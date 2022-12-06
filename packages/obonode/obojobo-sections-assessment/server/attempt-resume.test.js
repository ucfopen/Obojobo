/* eslint no-extend-native: 0 */

jest.mock('obojobo-express/server/insert_event')
jest.mock('obojobo-express/server/db')
jest.mock('./models/assessment')
jest.mock('./insert-events')

jest.mock(
	'obojobo-express/server/models/visit',
	() => ({
		fetchById: jest.fn()
	}),
	{ virtual: true }
)

const resumeAttempt = require('./attempt-resume')
const insertEvents = require('./insert-events')
const attemptStart = require('./attempt-start')
const insertEvent = require('obojobo-express/server/insert_event')
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

	test('returns attempt with chosen questions, questions do not have responses', async () => {
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

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue(mockAssessmentNode)
		}
		const mockCurrentVisit = { id: 'mockVisitId', is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)

		const mockResponses = new Map()
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValue(mockResponses)

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
		  "questionResponses": Array [],
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

	test('returns attempt with chosen questions, questions have responses', async () => {
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

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue(mockAssessmentNode)
		}
		const mockCurrentVisit = { id: 'mockVisitId', is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)

		const mockResponsesMap = new Map()
		mockResponsesMap.set(mockAttempt.id, [
			{
				id: 0,
				created_at: 0,
				attempt_id: 'mock-attempt-id',
				assessment_id: 'mock-assessment-id',
				question_id: 'mock-question-id',
				score: 0,
				response: { value: 'mock-value-1' }
			}
		])
		const mockResponses = mockResponsesMap
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValue(mockResponses)

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
		  "questionResponses": Array [
		    Object {
		      "assessment_id": "mock-assessment-id",
		      "attempt_id": "mock-attempt-id",
		      "created_at": 0,
		      "id": 0,
		      "question_id": "mock-question-id",
		      "response": Object {
		        "value": "mock-value-1",
		      },
		      "score": 0,
		    },
		  ],
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

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue('mock-assessment-node')
		}
		const mockCurrentVisit = { is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)

		const mockResponsesMap = new Map()
		mockResponsesMap.set(mockAttempt.id, [])
		const mockResponses = mockResponsesMap
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValue(mockResponses)

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

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue('mock-assessment-node')
		}
		const mockCurrentVisit = { id: 'mockVisitId', is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		AssessmentModel.fetchAttemptById.mockResolvedValue(mockAttempt)

		const mockResponsesMap = new Map()
		mockResponsesMap.set(mockAttempt.id, [])
		const mockResponses = mockResponsesMap
		AssessmentModel.fetchResponsesForAttempts.mockResolvedValue(mockResponses)
		// const mockAttempt = await AssessmentModel.getAttempt()

		await resumeAttempt(
			mockCurrentUser,
			mockCurrentVisit,
			mockCurrentDocument,
			'mockAttemptId',
			'mockHostName',
			'mockRemoteAddress'
		)

		expect(insertEvent).toHaveBeenCalledTimes(1)
		expect(insertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptResume",
		  "actorTime": "mockDate",
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
		AssessmentModel.invalidateAttempt.mockResolvedValueOnce(true)

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
		expect(insertEvents.insertAttemptInvalidatedEvent).toHaveBeenCalled()
	})

	test('rejects when attempting to resume module not matching the currentDocument (but does not insert an event if the attempt was already invalidated)', async () => {
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
		AssessmentModel.invalidateAttempt.mockResolvedValueOnce(null)

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
		expect(insertEvents.insertAttemptInvalidatedEvent).not.toHaveBeenCalled()
	})
})
