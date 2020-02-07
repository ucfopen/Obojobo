/* eslint no-extend-native: 0 */

jest.mock('obojobo-express/server/insert_event')
jest.mock('obojobo-express/server/db')
jest.mock('obojobo-express/server/routes/api/events/create_caliper_event')
jest.mock('./assessment') // from __mocks___

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
const Assessment = require('./assessment')
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'

attemptStart.getSendToClientPromises = jest.fn(() => [])

describe('start attempt route', () => {
	beforeAll(() => {
		Date.prototype.toISOString = () => 'mockDate'
		Visit.fetchById.mockReturnValue({ is_preview: false })
	})
	afterAll(() => {})
	beforeEach(() => {
		jest.restoreAllMocks()
		insertEvent.mockReset()
	})

	test('resumeAttempt inserts one event', async () => {
		expect.hasAssertions()

		const mockQuestionNode = {
			id: 'mockQuestion',
			type: QUESTION_NODE_TYPE,
			children: [],
			yell: jest.fn(),
			toObject: jest.fn().mockReturnValueOnce({})
		}

		const mockQuestionBank = {
			id: 'mockQuestionBank',
			type: QUESTION_BANK_NODE_TYPE
		}

		const mockAssessmentNode = {
			state: {
				chosen: [mockQuestionNode, mockQuestionBank]
			},
			draftTree: {
				getChildNodeById: jest.fn().mockReturnValue({
					node: {
						content: {
							attempts: 3
						}
					},
					children: [
						{},
						{
							childrenSet: [],
							buildAssessment: jest.fn().mockReturnValueOnce([mockQuestionNode])
						}
					],
					draftTree: {
						getChildNodeById: jest.fn().mockReturnValueOnce(mockQuestionNode)
					},
					toObject: jest.fn().mockReturnValueOnce({})
				})
			}
		}

		// mock the caliperEvent methods
		const mockCreateAssessmentAttemptResumedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		createCaliperEvent.mockReturnValueOnce({
			createAssessmentAttemptResumedEvent: mockCreateAssessmentAttemptResumedEvent
		})

		const mockCurrentDocument = {
			draftId: 'mockDraftId',
			contentId: 'mockContentId',
			getChildNodeById: jest.fn().mockReturnValue(mockAssessmentNode)
		}
		const mockCurrentVisit = { is_preview: 'mockIsPreview' }
		const mockCurrentUser = { id: 1 }
		Assessment.getAttempt.mockResolvedValue({
			assessment_id: 'mockAssessmentId',
			id: 'mockAttemptId',
			number: 'mockAttemptNumber',
			state: {
				chosen: [mockQuestionNode, mockQuestionBank]
			}
		})
		const mockAttempt = await Assessment.getAttempt()

		await resumeAttempt(
			mockCurrentUser,
			mockCurrentVisit,
			mockCurrentDocument,
			'mockAttemptId',
			'mockHostName',
			'mockRemoteAddress'
		)

		expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(1)
		expect(attemptStart.getSendToClientPromises).toHaveBeenCalledWith(
			mockAssessmentNode,
			mockAttempt.state,
			{}, // @TODO see if we can get rid of these
			{} // @TODO see if we can get rid of these
		)

		expect(mockCreateAssessmentAttemptResumedEvent).toHaveBeenCalledTimes(1)
		expect(insertEvent).toHaveBeenCalledTimes(1)
		expect(insertEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "action": "assessment:attemptResume",
		  "actorTime": "mockDate",
		  "caliperPayload": "mockCaliperPayload",
		  "contentId": "mockContentId",
		  "draftId": "mockDraftId",
		  "eventVersion": "1.1.0",
		  "ip": "mockRemoteAddress",
		  "isPreview": "mockIsPreview",
		  "metadata": Object {},
		  "payload": Object {
		    "attemptCount": "mockAttemptNumber",
		    "attemptId": "mockAttemptId",
		  },
		  "userId": 1,
		}
	`)
	})
})
