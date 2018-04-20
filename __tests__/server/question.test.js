import Question from '../../server/question'

const testJson = require('../../test-object.json')
const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')

jest.mock('../../../../db')

describe('Question', () => {
	const rootNode = new Draft(testJson)
	const question = new Question({}, { id: 'test' }, {})
	const testChild = new DraftNode({}, { id: 'test' }, {})
	const events = {
		sendToAssessment: 'ObojoboDraft.Sections.Assessment:sendToAssessment',
		attemptEnd: 'ObojoboDraft.Sections.Assessment:attemptEnd'
	}
	const currentAttempt = { addScore: jest.fn() }

	// @ADD BACK
	it.skip('disables practice on send to assessment', () => {
		let responseHistory = []
		question.node.content = { practice: true }
		question.yell(events.sendToAssessment, {}, {}, rootNode.root, responseHistory, currentAttempt)
		expect(question.node.content.practice).toBe(false)
	})

	it("returns if assessment doesn't contain 'this' node on attempt end", () => {
		expect(question.yell(events.attemptEnd, {}, {}, rootNode.root, {}, currentAttempt)).toEqual([])
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
	})

	it('returns if there are no question responses', () => {
		let responseHistory = []
		expect(
			question.yell(events.attemptEnd, {}, {}, rootNode.root, responseHistory, currentAttempt)
		).toEqual([])
		expect(currentAttempt.addScore).not.toHaveBeenCalled()
	})

	it('emits calculate score event when necessary', () => {
		const testAddScore = jest.fn((app, question, responses, addScore) => addScore(100))
		let responseRecord = { question_id: question.node.id }
		let responseHistory = [responseRecord]
		rootNode.root.children.push(question)
		testChild.registerEvents({ 'ObojoboDraft.Chunks.Question:calculateScore': testAddScore })
		question.children.push(testChild)
		question.yell(
			events.attemptEnd,
			{ app: {} },
			{},
			rootNode.root,
			responseHistory,
			currentAttempt
		)
		expect(currentAttempt.addScore).toHaveBeenCalled()
	})

	it('throws error if given non-unique question response rows', () => {
		const testAddScore = jest.fn((app, question, responses, addScore) => addScore(100))
		let responseRecord = { question_id: question.node.id }
		let responseRecord2 = { question_id: question.node.id }
		let responseHistory = [responseRecord, responseRecord2]
		rootNode.root.children.push(question)
		testChild.registerEvents({ 'ObojoboDraft.Chunks.Question:calculateScore': testAddScore })
		question.children.push(testChild)
		expect(() => {
			question.yell(
				events.attemptEnd,
				{ app: {} },
				{},
				rootNode.root,
				responseHistory,
				currentAttempt
			)
		}).toThrowError('Impossible response to MCAssessment question')
	})
})
