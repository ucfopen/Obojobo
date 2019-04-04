/* eslint no-extend-native: 0 */

const resumeAttempt = require('../../server/attempt-resume.js').resumeAttempt
const attemptStart = require('../../server/attempt-start.js')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event')
const Visit = oboRequire('models/visit')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'

jest.mock(
	'../../__mocks__/models/visit',
	() => ({
		fetchById: jest.fn()
	}),
	{ virtual: true }
)

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

	test('resumeAttempt inserts one event', () => {
		const mockRes = {
			success: jest.fn(),
			reject: jest.fn()
		}

		const mockAssessmentNode = {
			getChildNodeById: jest.fn(() => ({
				node: {
					content: {
						attempts: 3
					}
				},
				children: [
					{},
					{
						childrenSet: [],
						buildAssessment: jest.fn().mockReturnValueOnce([
							{
								id: 'mockQuestion',
								type: QUESTION_NODE_TYPE
							}
						])
					}
				],
				draftTree: {
					getChildNodeById: jest.fn().mockReturnValueOnce({
						id: 'mockQuestion',
						type: QUESTION_NODE_TYPE,
						children: [],
						yell: jest.fn(),
						toObject: jest.fn().mockReturnValueOnce({})
					})
				}
			})),
			state: {
				chosen: [
					{
						id: 'mockQuestion',
						type: QUESTION_NODE_TYPE
					},
					{
						id: 'mockQuestionBank',
						type: QUESTION_BANK_NODE_TYPE
					}
				]
			}
		}

		// mock the caliperEvent methods
		const createAssessmentAttemptResumedEvent = jest.fn().mockReturnValue('mockCaliperPayload')
		insertEvent.mockReturnValueOnce('mockInsertResult')
		createCaliperEvent.mockReturnValueOnce({ createAssessmentAttemptResumedEvent })

		const mockReq = {
			requireCurrentDocument: jest.fn(() => Promise.resolve(mockAssessmentNode)),
			requireCurrentUser: jest.fn(() =>
				Promise.resolve({
					id: 1,
					canViewEditor: true
				})
			),
			body: {
				attempt: mockAssessmentNode
			},
			hostname: 'mockHostname',
			connection: {
				remoteAddress: 'mockRemoteAddress'
			}
		}

		return resumeAttempt(mockReq, mockRes).then(() => {
			expect(mockReq.requireCurrentDocument).toHaveBeenCalledTimes(1)
			expect(mockReq.requireCurrentDocument).toHaveBeenCalledTimes(1)

			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(1)

			expect(insertEvent).toHaveBeenCalledTimes(1)

			expect(createAssessmentAttemptResumedEvent).toHaveBeenCalledTimes(1)
		})
	})
})
