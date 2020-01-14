const helpers = require('./attempt-end-helpers')
const lti = require('obojobo-express/server/lti')
const Assessment = require('../assessment')
const getCalculatedScores = require('./get-calculated-scores')
const insertEvents = require('./insert-events')
const DraftDocument = require('obojobo-express/server/models/draft')

jest.mock('obojobo-express/server/logger')
jest.mock('../assessment')
jest.mock('./get-calculated-scores')
jest.mock('./insert-events')
jest.mock('obojobo-express/server/lti')
jest.mock('obojobo-express/server/models/draft')

const mockCurrentUser = {
	id: 'mockCurrentUserId'
}

const mockAttempt = {
	draftId: 'mockDraftId',
	assessmentId: 'mockAssessmentId',
	assessmentModel: 'mockAssessmentModel',
	attemptState: 'mockAttemptState',
	number: 'mockNumber'
}

const mockCurrentVisit = {
	is_preview: 'mockIsPreview',
	resource_link_id: 'mockResourceLinkId'
}

const mockAttemptHistory = 'mockAttemptHistory'

const mockParams = {
	attemptId: 'mockAttemptId'
}

const mockCalculatedScores = {
	attempt: { attemptScore: 'mockAttemptScore' },
	assessmentScoreDetails: {
		assessmentModdedScore: 'mockAssessmentModdedScore'
	}
}

const mockLtiRequest = {
	gradebookStatus: 'mockGradebookStatus',
	ltiAssessmentScoreId: 'mockLtiAssessmentScoreId',
	scoreSent: 'mockScoreSent',
	status: 'mockStatus',
	statusDetails: 'mockStatusDetails'
}

const mockAssessmentScoreId = 'mockAssessmentScoreId'

const mockHostName = 'mockHostName'
const mockConnection = {
	remoteAddress: 'mockRemoteAddress'
}

const mockCurrentDocument = {
	contentId: 'mockContentId'
}

const mockResponsesForAttempt = 'mockResponsesForAttempt'

describe('attempt-end/attempt-end-helpers', () => {
	test('getAttemptHistory', async () => {
		Assessment.getCompletedAssessmentAttemptHistory.mockResolvedValueOnce(mockAttemptHistory)
		const mockReq = {
			currentUser: mockCurrentUser,
			attempt: mockAttempt,
			currentVisit: mockCurrentVisit
		}

		await helpers.getAttemptHistory(mockReq)

		expect(mockReq).toHaveProperty('attemptHistory', mockAttemptHistory)
		expect(Assessment.getCompletedAssessmentAttemptHistory).toBeCalledWith(
			'mockCurrentUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockIsPreview',
			'mockResourceLinkId'
		)
	})

	test('getResponsesForAttempt', async () => {
		Assessment.getResponsesForAttempt.mockResolvedValueOnce(mockResponsesForAttempt)
		const mockReq = {
			params: mockParams
		}

		await helpers.getResponsesForAttempt(mockReq)

		expect(mockReq).toHaveProperty('responsesForAttempt', mockResponsesForAttempt)
		expect(Assessment.getResponsesForAttempt).toBeCalledWith('mockAttemptId')
	})

	test('getCalculatedScores', async () => {
		getCalculatedScores.mockResolvedValueOnce(mockCalculatedScores)
		const mockReq = {
			attempt: mockAttempt,
			attemptHistory: mockAttemptHistory,
			responsesForAttempt: mockResponsesForAttempt
		}
		const mockRes = {}

		await helpers.getCalculatedScores(mockReq, mockRes)
		expect(mockReq).toHaveProperty('calculatedScores', mockCalculatedScores)
		expect(getCalculatedScores).toBeCalledWith(
			mockReq,
			mockRes,
			mockAttempt.assessmentModel,
			mockAttempt.attemptState,
			mockAttemptHistory,
			mockResponsesForAttempt
		)
	})

	test('completeAttempt', async () => {
		Assessment.completeAttempt.mockResolvedValueOnce({ assessmentScoreId: mockAssessmentScoreId })
		const mockReq = {
			attempt: mockAttempt,
			params: mockParams,
			currentUser: mockCurrentUser,
			currentDocument: mockCurrentDocument,
			currentVisit: mockCurrentVisit,
			calculatedScores: mockCalculatedScores
		}

		await helpers.completeAttempt(mockReq)
		expect(mockReq).toHaveProperty('assessmentScoreId', mockAssessmentScoreId)
		expect(Assessment.completeAttempt).toBeCalledWith(
			mockAttempt.assessmentId,
			mockParams.attemptId,
			mockCurrentUser.id,
			mockAttempt.draftId,
			mockCurrentDocument.contentId,
			mockCalculatedScores.attempt,
			mockCalculatedScores.assessmentScoreDetails,
			mockCurrentVisit.is_preview,
			mockCurrentVisit.resource_link_id
		)
	})

	test('insertAttemptEndEvents', async () => {
		const mockReturnValue = {}
		insertEvents.insertAttemptEndEvents.mockResolvedValueOnce(mockReturnValue)
		const mockReq = {
			attempt: mockAttempt,
			params: mockParams,
			currentUser: mockCurrentUser,
			currentDocument: mockCurrentDocument,
			currentVisit: mockCurrentVisit,
			hostname: mockHostName,
			connection: mockConnection
		}

		const actualReturnValue = await helpers.insertAttemptEndEvents(mockReq)

		expect(actualReturnValue).toBe(mockReturnValue)
		expect(insertEvents.insertAttemptEndEvents).toBeCalledWith(
			mockCurrentUser,
			mockCurrentDocument,
			mockAttempt.assessmentId,
			mockParams.attemptId,
			mockAttempt.number,
			mockCurrentVisit.is_preview,
			mockHostName,
			mockConnection.remoteAddress
		)
	}),
		test('sendHighestAssessmentScore', async () => {
			const mockReturnValue = {}
			lti.sendHighestAssessmentScore.mockResolvedValueOnce(mockReturnValue)
			const mockReq = {
				attempt: mockAttempt,
				currentUser: mockCurrentUser,
				currentDocument: mockCurrentDocument,
				currentVisit: mockCurrentVisit
			}
			await helpers.sendHighestAssessmentScore(mockReq)
			expect(mockReq).toHaveProperty('ltiRequest', mockReturnValue)
			expect(lti.sendHighestAssessmentScore).toBeCalledWith(
				mockCurrentUser.id,
				mockCurrentDocument,
				mockAttempt.assessmentId,
				mockCurrentVisit.is_preview,
				mockCurrentVisit.resource_link_id
			)
		})

	test('insertAttemptScoredEvents', async () => {
		const mockReturnValue = {}
		insertEvents.insertAttemptScoredEvents.mockResolvedValueOnce(mockReturnValue)
		const mockReq = {
			attempt: mockAttempt,
			params: mockParams,
			currentUser: mockCurrentUser,
			currentDocument: mockCurrentDocument,
			currentVisit: mockCurrentVisit,
			hostname: mockHostName,
			connection: mockConnection,
			ltiRequest: mockLtiRequest,
			calculatedScores: mockCalculatedScores,
			assessmentScoreId: mockAssessmentScoreId
		}

		const actualReturnValue = await helpers.insertAttemptScoredEvents(mockReq)

		expect(actualReturnValue).toBe(mockReturnValue)
		expect(insertEvents.insertAttemptScoredEvents).toBeCalledWith(
			mockCurrentUser,
			mockCurrentDocument,
			mockAttempt.assessmentId,
			mockAssessmentScoreId,
			mockParams.attemptId,
			mockAttempt.number,
			mockCalculatedScores.attempt.attemptScore,
			mockCalculatedScores.assessmentScoreDetails.assessmentModdedScore,
			mockCurrentVisit.is_preview,
			mockLtiRequest.scoreSent,
			mockLtiRequest.status,
			mockLtiRequest.statusDetails,
			mockLtiRequest.gradebookStatus,
			mockLtiRequest.ltiAssessmentScoreId,
			mockHostName,
			mockConnection.remoteAddress,
			mockCalculatedScores.assessmentScoreDetails,
			mockCurrentVisit.resource_link_id
		)
	})

	test('getAttempts', async () => {
		const mockReturnValue = {}
		Assessment.getAttempts.mockResolvedValueOnce(mockReturnValue)
		const mockReq = {
			attempt: mockAttempt,
			currentUser: mockCurrentUser,
			currentVisit: mockCurrentVisit
		}

		const actualReturnValue = await helpers.getAttempts(mockReq)

		expect(actualReturnValue).toBe(mockReturnValue)
		expect(Assessment.getAttempts).toBeCalledWith(
			mockCurrentUser.id,
			mockAttempt.draftId,
			mockCurrentVisit.is_preview,
			mockCurrentVisit.resource_link_id,
			mockAttempt.assessmentId
		)
	})

	test('get-attempt', async () => {
		const mockReq = {
			attempt: mockAttempt,
			currentUser: mockCurrentUser,
			currentVisit: mockCurrentVisit,
			params: {
				attemptId: 'mock-attempt-id'
			}
		}

		await helpers.getAttempt(mockReq)
		expect(Assessment.getAttempt).toBeCalledTimes(1)
		expect(Assessment.getAttempt).toBeCalledWith('mock-attempt-id')
		expect(Assessment.getAttemptNumber).toBeCalledTimes(1)
		expect(Assessment.getAttemptNumber).toBeCalledWith(
			'mockUserId',
			'mockDraftId',
			'mock-attempt-id'
		)

		expect(DraftDocument.fetchById).toBeCalledTimes(1)
		expect(DraftDocument.fetchById).toBeCalledWith('mockDraftId')

		expect(mockReq.attempt).toEqual({
			assessmentId: 'mockAssessmentId',
			number: 'mockAttemptNumber',
			attemptState: { chosen: [] },
			draftId: 'mockDraftId',
			model: expect.any(Object),
			assessmentModel: 'mockChild'
		})
	})
})
