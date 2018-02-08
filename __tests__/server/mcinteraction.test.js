import MCInteraction from '../../server/mcinteraction'
import testJson from '../../test-object.json'

const Draft = oboRequire('models/draft')
const DraftNode = oboRequire('models/draft_node')

jest.mock('../../../../db')

describe('MCInteraction', () => {
	let rootNode
	let mcInteraction
	let score
	const events = { onCalculateScore: 'ObojoboDraft.Chunks.Question:calculateScore' }
	const setScore = s => {
		score = s
	}

	beforeEach(() => {
		let getChildNodeByIdMock = id => mcInteraction.children.filter(i => i.node.id === id)[0]

		mcInteraction = new MCInteraction({ getChildNodeById: getChildNodeByIdMock }, { id: 'test' })
		mcInteraction.children = [
			new DraftNode({}, { id: 'test', content: { score: 100 } }, {}),
			new DraftNode({}, { id: 'test1', content: { score: 100 } }, {}),
			new DraftNode({}, { id: 'test2', content: { score: 0 } }, {}),
			new DraftNode({}, { id: 'test3', content: { score: 0 } }, {})
		]

		rootNode = new Draft(testJson)
		rootNode.root.children.push(mcInteraction)

		score = null
	})

	it("returns if question doesn't contain 'this' node on calulate score", () => {
		rootNode.root.children = []
		expect(mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, {}, setScore)).toEqual([])
		expect(score).toBe(null)
	})

	// it('throws error if multiple answers chosen (pick-one)', () => {
	// 	mcInteraction.node.content = { responseType: 'pick-one' }
	// 	let responseRecords = [new TestResponse('test', true), new TestResponse('test1', true)]
	// 	let errorMessage = 'Impossible response to non pick-all MCInteraction response'
	// 	let calculateScore = () =>
	// 		mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, {})
	// 	expect(calculateScore).toThrow(errorMessage)
	// })

	// it('sets score to 0 if no answer is chosen (pick-one)', () => {
	// 	mcInteraction.node.content = { responseType: 'pick-one' }
	// 	let responseRecords = []
	// 	mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecords, setScore)
	// 	expect(score).toEqual(0)
	// })

	it('sets score to 100 on correct answer chosen (pick-one)', () => {
		const responseRecord = { response: { ids: ['test'] } }
		mcInteraction.node.content = { responseType: 'pick-one' }
		mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(100)
	})

	it('sets score to 0 on wrong answer chosen (pick-one)', () => {
		const responseRecord = { response: { ids: ['test3'] } }
		mcInteraction.node.content = { responseType: 'pick-one' }
		mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(0)
	})

	it('sets score to 0 if number of chosen !== number of correct answers (pick-all)', () => {
		const responseRecord = { response: { ids: ['test'] } }
		mcInteraction.node.content = { responseType: 'pick-all' }
		mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(0)
	})

	it('sets score to 0 if any chosen answers are not the correct answer (pick-all)', () => {
		const responseRecord = { response: { ids: ['test', 'test1', 'test2'] } }
		mcInteraction.node.content = { responseType: 'pick-all' }
		mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(0)
	})

	it('sets score to 100 on correct answers chosen (pick-all)', () => {
		const responseRecord = { response: { ids: ['test', 'test1'] } }
		mcInteraction.node.content = { responseType: 'pick-all' }
		mcInteraction.yell(events.onCalculateScore, {}, rootNode.root, responseRecord, setScore)
		expect(score).toEqual(100)
	})
})
