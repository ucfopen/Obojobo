import MCAssessment from '../../server/mcassessment'
import testJson from '../../test-object.json'

const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')

jest.mock('../../../../db')

describe('MCAssessment', () => {
	let rootNode
	let mcAssessment
	let score
	const events = { onCalculateScore: 'ObojoboDraft.Chunks.Question:calculateScore' }
	const setScore = s => {
		score = s
	}

	beforeEach(() => {
		let getChildNodeByIdMock = id => mcAssessment.children.filter(i => i.node.id === id)[0]

		mcAssessment = new MCAssessment({ getChildNodeById: getChildNodeByIdMock }, { id: 'test' })
		mcAssessment.children = [
			new DraftNode({}, { id: 'test', content: { score: 100 } }, {}),
			new DraftNode({}, { id: 'test1', content: { score: 100 } }, {}),
			new DraftNode({}, { id: 'test2', content: { score: 0 } }, {}),
			new DraftNode({}, { id: 'test3', content: { score: 0 } }, {})
		]

		rootNode = new Draft(testJson)
		rootNode.root.children.push(mcAssessment)

		score = null
	})

	it("returns if question doesn't contain 'this' node on calulate score", () => {
		rootNode.root.children = []
		expect(mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, {}, setScore)).toEqual([])
		expect(score).toBe(null)
	})

	// it('throws error if multiple answers chosen (pick-one)', () => {
	// 	mcAssessment.node.content = { responseType: 'pick-one' }
	// 	let responseRecords = [new TestResponse('test', true), new TestResponse('test1', true)]
	// 	let errorMessage = 'Impossible response to non pick-all MCAssessment response'
	// 	let calculateScore = () =>
	// 		mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, {})
	// 	expect(calculateScore).toThrow(errorMessage)
	// })

	// it('sets score to 0 if no answer is chosen (pick-one)', () => {
	// 	mcAssessment.node.content = { responseType: 'pick-one' }
	// 	let responseRecords = []
	// 	mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
	// 	expect(score).toEqual(0)
	// })

	it('sets score to 100 on correct answer chosen (pick-one)', () => {
		const responseRecord = { response: { ids: ['test'] } }
		mcAssessment.node.content = { responseType: 'pick-one' }
		mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(100)
	})

	it('sets score to 0 on wrong answer chosen (pick-one)', () => {
		const responseRecord = { response: { ids: ['test3'] } }
		mcAssessment.node.content = { responseType: 'pick-one' }
		mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(0)
	})

	it('sets score to 0 if number of chosen !== number of correct answers (pick-all)', () => {
		const responseRecord = { response: { ids: ['test'] } }
		mcAssessment.node.content = { responseType: 'pick-all' }
		mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(0)
	})

	it('sets score to 0 if any chosen answers are not the correct answer (pick-all)', () => {
		const responseRecord = { response: { ids: ['test', 'test1', 'test2'] } }
		mcAssessment.node.content = { responseType: 'pick-all' }
		mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(0)
	})

	it('sets score to 100 on correct answers chosen (pick-all)', () => {
		const responseRecord = { response: { ids: ['test', 'test1'] } }
		mcAssessment.node.content = { responseType: 'pick-all' }
		mcAssessment.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(100)
	})
})
