import Question from '../../server/question'

const testJson = require('../../test-object.json')
const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')

describe('Question', () => {
	const rootNode = new Draft(testJson)
	const question = new Question({}, { id: 'mockQuestion' }, {})
	const testChild = new DraftNode({}, { id: 'mockNode' }, {})
	const events = {
		sendToAssessment: 'ObojoboDraft.Sections.Assessment:sendToAssessment',
		attemptEnd: 'ObojoboDraft.Sections.Assessment:attemptEnd'
	}
	const currentAttempt = { addScore: jest.fn() }

	it('registers expected events', () => {
		expect(question.registerEvents).toHaveBeenCalledTimes(1)
		let events = question.registerEvents.mock.calls[0][0]
		expect(question.registerEvents.mock.calls[0]).toMatchSnapshot()
		expect(events['ObojoboDraft.Sections.Assessment:sendToAssessment']).toBe(
			question.onSendToAssessment
		)
		expect(events['ObojoboDraft.Sections.Assessment:attemptEnd']).toBe(question.onAttemptEnd)
	})

	it('disables practice on send to assessment', () => {
		let responseHistory = []
		question.node.content = { mode: 'practice' }
		question.onSendToAssessment()
		expect(question.node.content.mode).toBe('assessment')
	})

	it("returns if assessment doesn't contain 'this' node on attempt end", () => {
		let mockAssessment = { contains: () => false }
		let res = question.onAttemptEnd({}, {}, mockAssessment, {}, currentAttempt)
		expect(res).toBe(undefined)
		expect(question.yell).not.toHaveBeenCalled()
	})

	it('returns if there are no question responses', () => {
		let mockAssessment = { contains: () => true }

		let res = question.onAttemptEnd({}, {}, mockAssessment, [], currentAttempt)
		expect(res).toEqual(undefined)
		expect(question.yell).not.toHaveBeenCalled()
	})

	it('emits calculate score event when necessary', () => {
		let mockAssessment = { contains: () => true }
		let responseHistory = [{ question_id: question.node.id }]

		let res = {
			app: {}
		}

		expect(question.yell).not.toHaveBeenCalled()
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
		let result = question.onAttemptEnd(res, {}, mockAssessment, responseHistory, currentAttempt)
		expect(question.yell).toHaveBeenCalled()
		expect(question.yell.mock.calls[0]).toMatchSnapshot()

		// now let's test the yell function
		let scoreYellFunc = question.yell.mock.calls[0][4]
		scoreYellFunc(50)
		expect(currentAttempt.addScore).toHaveBeenCalledWith('mockQuestion', 50)
	})

	it('throws error if given non-unique question response rows', () => {
		let mockAssessment = { contains: () => true }

		let responseRecord = { question_id: question.node.id }
		let responseRecord2 = { question_id: question.node.id }
		let responseHistory = [responseRecord, responseRecord2]

		expect(() => {
			question.onAttemptEnd({}, {}, mockAssessment, responseHistory, currentAttempt)
		}).toThrowError('Impossible response to MCAssessment question')
	})
})
