jest.mock('../../server/questionselector', () => jest.fn())

const QuestionBank = require('../../server/questionbank')
const getQuestions = require('../../server/questionselector')

describe('QuestionBank', () => {
	test('has empty children array on send to client event', () => {
		const questionBank = new QuestionBank()
		const events = {
			onSendToClient: 'ObojoboDraft.Sections.Assessment:sendToClient',
			onAttemptStart: 'ObojoboDraft.Sections.Assessment:attemptStart'
		}
		questionBank.children = ['test']
		questionBank.yell(events.onSendToClient)
		expect(questionBank.children).toHaveLength(0)
	})

	test('onAttemptStart inserts new questions', () => {
		const node = { id: 9, g: true }
		const questionBank = new QuestionBank({}, node)

		const currentAttempt = {
			getQuestions: jest.fn(() => [{ node: { id: 1 } }, questionBank.node, { node: { id: 2 } }]),
			setQuestions: jest.fn()
		}
		// newQuestions
		getQuestions.mockReturnValueOnce([{ node: { id: 'a' } }, { node: { id: 'b' } }])
		questionBank.onAttemptStart({}, {}, {}, {}, currentAttempt)
		expect(currentAttempt.setQuestions).toHaveBeenCalledWith([
			{ node: { id: 1 } },
			{ node: { id: 'a' } },
			{ node: { id: 'b' } },
			{ node: { id: 2 } }
		])
	})

	test('onAttemptStart does nothing when node isnt in questions', () => {
		const node = { id: 9, g: true }
		const questionBank = new QuestionBank({}, node)

		const currentAttempt = {
			getQuestions: jest.fn(() => [{ node: { id: 1 } }, { node: { id: 3 } }, { node: { id: 2 } }]),
			setQuestions: jest.fn()
		}
		// newQuestions
		getQuestions.mockReturnValueOnce([{ node: { id: 'a' } }, { node: { id: 'b' } }])
		questionBank.onAttemptStart({}, {}, {}, {}, currentAttempt)
		expect(currentAttempt.setQuestions).not.toHaveBeenCalled()
	})
})
