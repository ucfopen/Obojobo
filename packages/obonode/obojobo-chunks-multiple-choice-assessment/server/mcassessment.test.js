import MCAssessment from '../../server/mcassessment'

const DraftNode = oboRequire('models/draft_node')

describe('MCAssessment', () => {
	let mcAssessment
	const setScore = jest.fn()

	beforeEach(() => {
		jest.resetAllMocks()
		const getChildNodeByIdMock = id => mcAssessment.children.filter(i => i.node.id === id)[0]

		mcAssessment = new MCAssessment({ getChildNodeById: getChildNodeByIdMock }, { id: 'test' })
		mcAssessment.children = [
			new DraftNode({}, { id: 'test', content: { score: 100 } }, {}),
			new DraftNode({}, { id: 'test1', content: { score: 100 } }, {}),
			new DraftNode({}, { id: 'test2', content: { score: 0 } }, {}),
			new DraftNode({}, { id: 'test3', content: { score: 0 } }, {})
		]

		// set up the immediate children
		mcAssessment.children.forEach(c => {
			mcAssessment.immediateChildrenSet.add(c.node.id)
		})
	})

	test('constructor registers the expected events', () => {
		expect(mcAssessment.registerEvents).toHaveBeenCalled()
		expect(mcAssessment.registerEvents.mock.calls[0]).toMatchSnapshot()
	})

	test("onCalculateScore stops if question doesn't contain 'this' node", () => {
		const question = { contains: () => false }
		const res = mcAssessment.onCalculateScore({}, question, {}, setScore)
		expect(res).toBe(undefined) //eslint-disable-line
		expect(setScore).not.toHaveBeenCalled()
	})

	test('onCalculateScore sets score to 100 on correct answer chosen (pick-one)', () => {
		const question = { contains: () => true }
		const responseRecord = { response: { ids: ['test'] } }
		mcAssessment.node.content = { responseType: 'pick-one' }
		expect(setScore).not.toHaveBeenCalled()
		mcAssessment.onCalculateScore({}, question, responseRecord, setScore)
		expect(setScore).toHaveBeenCalledWith(100)
	})

	test('onCalculateScore sets score to 0 on wrong answer chosen (pick-one)', () => {
		const question = { contains: () => true }
		const responseRecord = { response: { ids: ['test3'] } }
		mcAssessment.node.content = { responseType: 'pick-one' }
		expect(setScore).not.toHaveBeenCalled()
		mcAssessment.onCalculateScore({}, question, responseRecord, setScore)
		expect(setScore).toHaveBeenCalledWith(0)
	})

	test('onCalculateScore sets score to 0 if number of chosen !== number of correct answers (pick-all)', () => {
		const question = { contains: () => true }
		const responseRecord = { response: { ids: ['test'] } }
		mcAssessment.node.content = { responseType: 'pick-all' }

		expect(setScore).not.toHaveBeenCalled()
		mcAssessment.onCalculateScore({}, question, responseRecord, setScore)
		expect(setScore).toHaveBeenCalledWith(0)
	})

	test('onCalculateScore sets score to 0 if any chosen answers are not the correct answer (pick-all)', () => {
		const question = { contains: () => true }
		const responseRecord = { response: { ids: ['test', 'test2'] } }
		mcAssessment.node.content = { responseType: 'pick-all' }

		expect(setScore).not.toHaveBeenCalled()
		mcAssessment.onCalculateScore({}, question, responseRecord, setScore)
		expect(setScore).toHaveBeenCalledWith(0)
	})

	test('onCalculateScore sets score to 100 on correct answers chosen (pick-all)', () => {
		const question = { contains: () => true }
		const responseRecord = { response: { ids: ['test', 'test1'] } }
		mcAssessment.node.content = { responseType: 'pick-all' }

		expect(setScore).not.toHaveBeenCalled()
		mcAssessment.onCalculateScore({}, question, responseRecord, setScore)
		expect(setScore).toHaveBeenCalledWith(100)
	})

	test('onCalculateScore does not require responseType to be specified and will use a default', () => {
		const question = { contains: () => true }
		const responseRecord = { response: { ids: ['test'] } }
		mcAssessment.node.content = {}
		expect(setScore).not.toHaveBeenCalled()
		mcAssessment.onCalculateScore({}, question, responseRecord, setScore)
		expect(setScore).toHaveBeenCalledWith(100)
	})
})
