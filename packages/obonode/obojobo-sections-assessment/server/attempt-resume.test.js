/* eslint no-extend-native: 0 */

jest.mock('obojobo-express/server/insert_event')
jest.mock('obojobo-express/server/db')
jest.mock('obojobo-express/server/routes/api/events/create_caliper_event')
jest.mock('./models/assessment')

jest.mock(
	'obojobo-express/server/models/visit',
	() => ({
		fetchById: jest.fn()
	}),
	{ virtual: true }
)

const resumeAttempt = require('./attempt-resume')
const attemptStart = require('./attempt-start')
const insertEvent = require('obojobo-express/server/insert_event')
const createCaliperEvent = require('obojobo-express/server/routes/api/events/create_caliper_event')
const Visit = require('obojobo-express/server/models/visit')
const AssessmentModel = require('./models/assessment')
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

attemptStart.getSendToClientPromises = jest.fn(() => [])

describe('Resume Attempt Route', () => {
	beforeAll(() => {
		Date.prototype.toISOString = () => 'mockDate'
		Visit.fetchById.mockReturnValue({ is_preview: false })
	})
	afterAll(() => {})
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.clearAllMocks()
		insertEvent.mockReset()
	})

	test('returns attempt with chosen questions', async () => {
		expect.hasAssertions()

		const questionNode1 = {
			id: 'node1',
			type: QUESTION_NODE_TYPE
		}

		const questionNode2 = {
			id: 'node2',
			type: QUESTION_NODE_TYPE
		}

		const nonQuestionNode = {
			id: 'node3',
			type: 'NOT_A_QUESTION_NODE_TYPE'
		}

		const mockAttempt = {
			assessmentId: 'mockAssessmentId',
			id: 'mockAttemptId',
			number: 'mockAttemptNumber',
			draftId: 'mockDraftId',
			draftContentId: 'mockContentId',
			state: {
				chosen: [questionNode1, questionNode2, nonQuestionNode]
			}
		}

		const mockAssessmentNode = {
			draftTree: {
				// called to get question nodes by id
				getChildNodeById: jest.fn().mockReturnValue({
					toObject: () => 'mock-to-object'
				})
			}
		}

		// mock the caliperEvent methods
		const mockCreateAssessmentAttemptResumedEvent = jest.fn()
		mockCreateAssessmentAttemptResumedEvent.mockReturnValue('mockCaliperPayload')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptResumedEvent: mockCreateAssessmentAttemptResumedEvent
		})

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue(mockAssessmentNode)
		}
		const mockCurrentVisit = { id: 'mockVisitId', is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)

		const result = await resumeAttempt(
			mockCurrentUser,
			mockCurrentVisit,
			mockCurrentDocument,
			'mockAttemptId',
			'mockHostName',
			'mockRemoteAddress'
		)

		expect(result).toMatchInlineSnapshot(`
		Object {
		  "assessmentId": "mockAssessmentId",
		  "attemptId": "mockAttemptId",
		  "draftContentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "number": "mockAttemptNumber",
		  "questions": Array [
		    "mock-to-object",
		    "mock-to-object",
		  ],
		  "state": Object {
		    "chosen": Array [
		      Object {
		        "id": "node1",
		        "type": "ObojoboDraft.Chunks.Question",
		      },
		      Object {
		        "id": "node2",
		        "type": "ObojoboDraft.Chunks.Question",
		      },
		      Object {
		        "id": "node3",
		        "type": "NOT_A_QUESTION_NODE_TYPE",
		      },
		    ],
		  },
		}
	`)
	})

	test('calls getSendToClientPromises', async () => {
		expect.hasAssertions()

		const mockAttempt = {
			assessmentId: 'mockAssessmentId',
			id: 'mockAttemptId',
			number: 'mockAttemptNumber',
			draftId: 'mockDraftId',
			draftContentId: 'mockContentId',
			state: {
				chosen: [] // skip building attempt.questions
			}
		}

		// mock the caliperEvent methods
		const mockCreateAssessmentAttemptResumedEvent = jest.fn()
		mockCreateAssessmentAttemptResumedEvent.mockReturnValue('mockCaliperPayload')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptResumedEvent: mockCreateAssessmentAttemptResumedEvent
		})

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue('mock-assessment-node')
		}
		const mockCurrentVisit = { is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)

		await resumeAttempt(
			mockCurrentUser,
			mockCurrentVisit,
			mockCurrentDocument,
			'mockAttemptId',
			'mockHostName',
			'mockRemoteAddress'
		)

		expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(1)
		expect(attemptStart.getSendToClientPromises.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "mock-assessment-node",
		  Object {
		    "chosen": Array [],
		  },
		  Object {},
		  Object {},
		]
	`)
	})

	test('calls insertEvent with expected event', async () => {
		expect.hasAssertions()

		const mockAttempt = {
			assessmentId: 'mockAssessmentId',
			id: 'mockAttemptId',
			number: 'mockAttemptNumber',
			draftId: 'mockDraftId',
			draftContentId: 'mockContentId',
			state: {
				chosen: [] // skip building attempt.questions
			}
		}

		// mock the caliperEvent methods
		const mockCreateAssessmentAttemptResumedEvent = jest.fn()
		mockCreateAssessmentAttemptResumedEvent.mockReturnValue('mockCaliperPayload')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptResumedEvent: mockCreateAssessmentAttemptResumedEvent
		})

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue('mock-assessment-node')
		}
		const mockCurrentVisit = { id: 'mockVisitId', is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)
		// const mockAttempt = await AssessmentModel.getAttempt()

		await resumeAttempt(
			mockCurrentUser,
			mockCurrentVisit,
			mockCurrentDocument,
			'mockAttemptId',
			'mockHostName',
			'mockRemoteAddress'
		)

		expect(mockCreateAssessmentAttemptResumedEvent).toHaveBeenCalledTimes(1)
		expect(mockCreateAssessmentAttemptResumedEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "actor": Object {
		    "id": 1,
		    "type": "user",
		  },
		  "assessmentId": "mockAssessmentId",
		  "attemptId": "mockAttemptId",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		}
	`)
		expect(insertEvent).toHaveBeenCalledTimes(1)
		expect(insertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptResume",
		  "actorTime": "mockDate",
		  "caliperPayload": "mockCaliperPayload",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "eventVersion": "1.2.0",
		  "ip": "mockRemoteAddress",
		  "isPreview": "mockIsPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "attemptCount": "mockAttemptNumber",
		    "attemptId": "mockAttemptId",
		  },
		  "userId": 1,
		  "visitId": "mockVisitId",
		}
	`)
	})

	test('rejects when attempting to resume module not matching the currentDocument', async () => {
		expect.hasAssertions()

		const mockAttempt = {
			draftId: 'differentMockDraftId',
			draftContentId: 'differentMockContentId'
		}

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn()
		}

		AssessmentModel.fetchAttemptById.mockResolvedValueOnce(mockAttempt)

		await expect(
			resumeAttempt(
				'mockCurrentUser',
				'mockCurrentVisit',
				mockCurrentDocument,
				'mockAttemptId',
				'mockHostName',
				'mockRemoteAddress'
			)
		).rejects.toThrow(Error('Cannot resume an attempt for a different module'))

		await expect(AssessmentModel.invalidateAttempt).toHaveBeenCalledWith('mockAttemptId')
	})
})
