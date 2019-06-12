const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const getCalculatedScores = require('./get-calculated-scores')

jest.mock('../../assessment-rubric')

const mockYell = jest
	.fn()
	.mockImplementation((name, req, res, assessmentModel, responseHistory, obj) => {
		obj.addScore('mockId_1', 20)
		return []
	})

const mockReq = {}
const mockRes = {}
const mockAssessmentModel = {
	yell: mockYell,
	node: {
		content: {
			attempts: 1
		}
	}
}
const mockAttemptState = {
	chosen: [{ type: QUESTION_NODE_TYPE, id: 'mockId_1' }, { type: 'otherNodeType' }]
}
const mockAttemptHistory = [
	{
		result: {
			attemptScore: 80
		}
	}
]
const mockResponseHistory = {}

describe('attempt-end/get-calculated-scores', () => {
	test('returns as expected when node.content.attempts has value', async () => {
		const result = await getCalculatedScores(
			mockReq,
			mockRes,
			mockAssessmentModel,
			mockAttemptState,
			mockAttemptHistory,
			mockResponseHistory
		)

		expect(result).toEqual({
			assessmentScoreDetails: 'mockAssessmentScoreDetails',
			attempt: { attemptScore: 20, questionScores: [{ id: 'mockId_1', score: 20 }] }
		})
	})

	test('returns as expected when node.content.attempts is "unlimited"', async () => {
		mockAssessmentModel.node.content.attempts = 'unlimited'
		const result = await getCalculatedScores(
			mockReq,
			mockRes,
			mockAssessmentModel,
			mockAttemptState,
			mockAttemptHistory,
			mockResponseHistory
		)

		expect(result).toEqual({
			assessmentScoreDetails: 'mockAssessmentScoreDetails',
			attempt: { attemptScore: 20, questionScores: [{ id: 'mockId_1', score: 20 }] }
		})
	})

	test('returns as expected when node.content.attempts is undefined', async () => {
		delete mockAssessmentModel.node.content.attempts
		const result = await getCalculatedScores(
			mockReq,
			mockRes,
			mockAssessmentModel,
			mockAttemptState,
			mockAttemptHistory,
			mockResponseHistory
		)

		expect(result).toEqual({
			assessmentScoreDetails: 'mockAssessmentScoreDetails',
			attempt: { attemptScore: 20, questionScores: [{ id: 'mockId_1', score: 20 }] }
		})
	})
})
