jest.mock('obojobo-express/server/lti')
jest.mock('obojobo-express/server/db')
jest.mock('../models/assessment-score')
jest.mock('../models/assessment')
jest.mock('./get-calculated-scores')
jest.mock('./insert-events')

const lti = require('obojobo-express/server/lti')
const AssessmentModel = require('../models/assessment')
const AssessmentScore = require('../models/assessment-score')
const insertEvents = require('./insert-events')
const attemptImport = require('./attempt-import')
const db = require('obojobo-express/server/db')

describe('attempt-import', () => {
	let mockReq
	let mockCurrentVisit
	let mockCurrentUser
	let mockCurrentDocument
	let mockAssessmentScore
	let mockAttempt
	let mockLtiRequestResult

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()

		db.tx.mockImplementation(cb => cb(db))

		mockLtiRequestResult = {
			scoreSent: 'mock-lti-scoreSent',
			status: 'mock-lti-status',
			statusDetails: 'mock-lti-statusDetails',
			gradebookStatus: 'mock-lti-gradebookStatus',
			ltiAssessmentScoreId: 'mock-lti-ltiAssessmentScoreId'
		}

		mockAttempt = {
			id: 'mock-attempt-id',
			userId: 'mockCurrentUserId',
			importAsNewAttempt: jest.fn()
		}

		mockAssessmentScore = {
			id: 'mock-score-id',
			attemptId: 'mockScoreAttemptId',
			userId: 'mockCurrentUserId',
			draftId: 'mockDraftId',
			draftContentId: 'mockContentId',
			importAsNewScore: jest.fn()
		}

		mockCurrentVisit = {
			is_preview: 'mockIsPreview',
			resource_link_id: 'mockResourceLinkId',
			score_importable: true
		}

		mockCurrentUser = {
			id: 'mockCurrentUserId'
		}

		mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn()
		}

		mockReq = {
			currentUser: mockCurrentUser,
			currentVisit: mockCurrentVisit,
			currentDocument: mockCurrentDocument,
			body: {
				importedAssessmentScoreId: 'mock-id-to-import'
			},
			params: {
				attemptId: 'mock-attempt-id'
			},
			connection: {
				remoteAddress: 'mockRemoteAddress'
			},
			hostname: 'mockHostName'
		}
	})

	test('throws when currentVisit not marked as importable', () => {
		mockCurrentVisit.score_importable = false
		return expect(attemptImport(mockReq)).rejects.toThrowError(
			'Import score used on visit without import enabled.'
		)
	})

	test('requires resumed SCORE to belong to current user', () => {
		mockAssessmentScore.userId = 'someone-else'
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		return expect(attemptImport(mockReq)).rejects.toThrowError(
			'Imported scores must be owned by the current user.'
		)
	})

	test('requires resumed SCORE to match current draftId', () => {
		mockAssessmentScore.draftId = 'some-other-draft-id'
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		return expect(attemptImport(mockReq)).rejects.toThrowError(
			'Scores can only be imported for the same module.'
		)
	})

	test('requires resumed SCORE to match current draft version', () => {
		mockAssessmentScore.draftContentId = 'a-different-version'
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		return expect(attemptImport(mockReq)).rejects.toThrowError(
			'Scores can only be imported for the same version of a module.'
		)
	})

	test('requires that no previous attempts were made ', () => {
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce(['mock-attempt-data'])
		return expect(attemptImport(mockReq)).rejects.toThrowError(
			'Scores can only be imported if no assessment attempts have been made.'
		)
	})

	test('calls AssessmentModel.fetchAttemptHistory', async () => {
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce(['mock-attempt-data'])

		try {
			await attemptImport(mockReq)
		} catch (e) {
			// ignore
		}

		expect(AssessmentModel.fetchAttemptHistory).toHaveBeenCalledTimes(1)
		expect(AssessmentModel.fetchAttemptHistory).toHaveBeenCalledWith(
			'mockCurrentUserId',
			'mockDraftId',
			'mockIsPreview',
			'mockResourceLinkId'
		)
	})

	test('requires resumed ATTEMPT belongs to current user', () => {
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce([])
		mockAttempt.userId = 'not-the-same-user'
		AssessmentModel.fetchAttemptById.mockResolvedValueOnce(mockAttempt)

		return expect(attemptImport(mockReq)).rejects.toThrowError(
			'Original attempt was not created by the current user.'
		)
	})

	test('inserts attempt end event', async () => {
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce([])
		AssessmentModel.fetchAttemptById.mockResolvedValueOnce(mockAttempt)
		mockAttempt.importAsNewAttempt.mockResolvedValueOnce(mockAttempt)
		mockAssessmentScore.importAsNewScore.mockResolvedValueOnce({ id: 'imported-score-id' })
		AssessmentModel.getCompletedAssessmentAttemptHistory.mockResolvedValueOnce('mock-history')
		lti.sendHighestAssessmentScore.mockResolvedValueOnce(mockLtiRequestResult)
		insertEvents.insertAttemptImportedEvents.mockResolvedValueOnce()
		await attemptImport(mockReq)
		expect(insertEvents.insertAttemptEndEvents).toHaveBeenCalledTimes(1)
		expect(insertEvents.insertAttemptEndEvents.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "id": "mockCurrentUserId",
		  },
		  Object {
		    "contentId": "mockContentId",
		    "draftId": "mockDraftId",
		    "getChildNodeById": [MockFunction],
		  },
		  undefined,
		  "mock-attempt-id",
		  undefined,
		  "mockIsPreview",
		  "mockHostName",
		  "mockRemoteAddress",
		]
	`)
	})

	test('sends hights score via lti', async () => {
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce([])
		AssessmentModel.fetchAttemptById.mockResolvedValueOnce(mockAttempt)
		mockAttempt.importAsNewAttempt.mockResolvedValueOnce(mockAttempt)
		mockAssessmentScore.importAsNewScore.mockResolvedValueOnce({ id: 'imported-score-id' })
		AssessmentModel.getCompletedAssessmentAttemptHistory.mockResolvedValueOnce('mock-history')
		lti.sendHighestAssessmentScore.mockResolvedValueOnce(mockLtiRequestResult)
		insertEvents.insertAttemptImportedEvents.mockResolvedValueOnce()
		await attemptImport(mockReq)
		expect(lti.sendHighestAssessmentScore).toHaveBeenCalledTimes(1)
		expect(lti.sendHighestAssessmentScore.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "mockCurrentUserId",
		  Object {
		    "contentId": "mockContentId",
		    "draftId": "mockDraftId",
		    "getChildNodeById": [MockFunction],
		  },
		  undefined,
		  "mockIsPreview",
		  "mockResourceLinkId",
		]
	`)
	})

	test('inserts attempt import event', async () => {
		// setup
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce([])
		AssessmentModel.fetchAttemptById.mockResolvedValueOnce(mockAttempt)
		mockAttempt.importAsNewAttempt.mockResolvedValueOnce(mockAttempt)
		mockAssessmentScore.importAsNewScore.mockResolvedValueOnce({ id: 'imported-score-id' })
		AssessmentModel.getCompletedAssessmentAttemptHistory.mockResolvedValueOnce('mock-history')
		lti.sendHighestAssessmentScore.mockResolvedValueOnce(mockLtiRequestResult)
		insertEvents.insertAttemptImportedEvents.mockResolvedValueOnce()
		mockReq.params.assessmentId = 'mock-assessment-id-req-param'

		// execute
		await attemptImport(mockReq)

		// verify
		expect(insertEvents.insertAttemptImportedEvents).toHaveBeenCalledTimes(1)
		expect(insertEvents.insertAttemptImportedEvents.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "mockCurrentUserId",
		  "mockDraftId",
		  "mockContentId",
		  "mock-assessment-id-req-param",
		  "mock-attempt-id",
		  "imported-score-id",
		  "mockScoreAttemptId",
		  "mock-score-id",
		  "mockIsPreview",
		  "mock-lti-scoreSent",
		  "mock-lti-status",
		  "mock-lti-statusDetails",
		  "mock-lti-gradebookStatus",
		  "mock-lti-ltiAssessmentScoreId",
		  "mockHostName",
		  "mockRemoteAddress",
		  "mockResourceLinkId",
		]
	`)
	})

	test('returns history and importedScore', async () => {
		// setup
		AssessmentScore.fetchById.mockResolvedValueOnce(mockAssessmentScore)
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce([])
		AssessmentModel.fetchAttemptById.mockResolvedValueOnce(mockAttempt)
		mockAttempt.importAsNewAttempt.mockResolvedValueOnce(mockAttempt)
		mockAssessmentScore.importAsNewScore.mockResolvedValueOnce({ id: 'imported-score-id' })
		AssessmentModel.getCompletedAssessmentAttemptHistory.mockResolvedValueOnce('mock-history')
		lti.sendHighestAssessmentScore.mockResolvedValueOnce(mockLtiRequestResult)
		insertEvents.insertAttemptImportedEvents.mockResolvedValueOnce()

		// execute
		const result = await attemptImport(mockReq)

		// verify
		expect(result).toMatchInlineSnapshot(`
		Object {
		  "history": "mock-history",
		  "importedScore": Object {
		    "id": "imported-score-id",
		  },
		}
	`)
	})
})
