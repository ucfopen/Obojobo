/* eslint no-undefined: 0 */
jest.setMock(
	'obojobo-express/models/draft_node',
	require('obojobo-document-engine/__mocks__/models/draft_node')
)

let question
let currentAttempt
let Question

describe('Question', () => {
	beforeEach(() => {
		Question = require('./question')
		question = new Question({}, { id: 'mockQuestion', content: { type: 'default' } }, {})
		currentAttempt = { addScore: jest.fn() }
	})

	test('nodeName is expected value', () => {
		expect(Question.nodeName).toBe('ObojoboDraft.Chunks.Question')
	})

	test('registers expected events', () => {
		expect(question.registerEvents).toHaveBeenCalledTimes(1)
		expect(question.registerEvents.mock.calls[0]).toMatchSnapshot()
		expect(question.registerEvents).toHaveBeenCalledWith({
			'ObojoboDraft.Sections.Assessment:attemptEnd': question.onAttemptEnd
		})
	})

	test("returns if assessment doesn't contain 'this' node on attempt end", () => {
		const mockAssessment = { contains: () => false }
		const res = question.onAttemptEnd({}, {}, mockAssessment, {}, currentAttempt)
		expect(res).toBe(undefined)
		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
	})

	test('returns if there are no question responses', () => {
		const mockAssessment = { contains: () => true }

		const res = question.onAttemptEnd({}, {}, mockAssessment, [], currentAttempt)
		expect(res).toEqual(undefined)
		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).toHaveBeenCalledWith('mockQuestion', 0)
	})

	test('returns if question is a survey question', () => {
		question.node.content.type = 'survey'
		const mockAssessment = { contains: () => true }

		const res = question.onAttemptEnd({}, {}, mockAssessment, [], currentAttempt)
		expect(res).toEqual(undefined)
		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).toHaveBeenCalledWith('mockQuestion', 'no-score')
	})

	test('calls addScore to 0 and does not yell if no response found', () => {
		const mockAssessment = { contains: () => true }
		const responseHistory = [{ question_id: 'someOtherId' }]

		const res = {
			app: {}
		}

		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
		question.onAttemptEnd(res, {}, mockAssessment, responseHistory, currentAttempt)
		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).toHaveBeenCalledWith('mockQuestion', 0)
	})

	test('emits calculate score event when necessary', () => {
		question.node.content = { mode: 'assessment' }
		const mockAssessment = { contains: () => true }
		const responseHistory = [{ question_id: question.node.id }]

		const res = {
			app: {}
		}

		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
		question.onAttemptEnd(res, {}, mockAssessment, responseHistory, currentAttempt)
		expect(question.yell).toHaveBeenCalled()
		expect(question.yell.mock.calls[0]).toMatchSnapshot()

		// now let's test the yell function
		const scoreYellFunc = question.yell.mock.calls[0][4]
		scoreYellFunc(50)
		expect(currentAttempt.addScore).toHaveBeenCalledWith('mockQuestion', 50)
	})

	test('throws error if given non-unique question response rows', () => {
		const mockAssessment = { contains: () => true }

		const responseRecord = { question_id: question.node.id }
		const responseRecord2 = { question_id: question.node.id }
		const responseHistory = [responseRecord, responseRecord2]

		expect(() => {
			question.onAttemptEnd({}, {}, mockAssessment, responseHistory, currentAttempt)
		}).toThrowError('Impossible response to MCAssessment question')
	})

	test('buildAssessment returns itself as an object', () => {
		const object = question.buildAssessment()

		expect(object).toEqual(
			expect.objectContaining({
				children: [],
				content: undefined,
				id: undefined,
				type: undefined
			})
		)
	})
})
