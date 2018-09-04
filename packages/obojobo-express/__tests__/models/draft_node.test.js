jest.mock('../../db')

let mockRawDraft = {
	id: 'whatever',
	version: 9,
	draft_created_at: new Date().toISOString(),
	content_created_at: new Date().toISOString(),
	content: {
		id: 666,
		stuff: true,
		type: 'DraftNode',
		content: { nothing: true },
		children: [
			{
				id: 999,
				type: 'DraftNode',
				content: { otherStuff: true },
				children: [
					{
						id: 777,
						type: 'DraftNode',
						content: { otherStuff: true }
					}
				]
			},
			{
				id: 888,
				type: 'DraftNode',
				content: { otherStuff: false }
			}
		]
	}
}

describe('models draft', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('initializes expected properties', () => {
		let DraftNode = oboRequire('models/draft_node')
		const draftTree = {}
		let initFn = jest.fn()
		let d = new DraftNode(draftTree, mockRawDraft.content, initFn)
		expect(d.draftTree).toBe(draftTree)
		expect(d.node).toEqual(
			expect.objectContaining({
				id: 666,
				content: { nothing: true }
			})
		)
		expect(d.node).not.toBe(mockRawDraft)
		expect(d.node).not.toHaveProperty('children')
		expect(d.init).toBe(initFn)
		expect(d.children).toBeInstanceOf(Array)
		expect(d.children).toHaveLength(0)
	})

	it('calls passed init function', () => {
		let DraftNode = oboRequire('models/draft_node')
		const draftTree = {}
		let initFn = jest.fn()
		let d = new DraftNode(draftTree, mockRawDraft.content, initFn)
		expect(d.init).toBe(initFn)
		d.init()
		expect(initFn).toHaveBeenCalledTimes(1)
	})

	it('converts itself to an object', () => {
		let DraftNode = oboRequire('models/draft_node')
		const draftTree = {}
		let initFn = jest.fn()
		let d = new DraftNode(draftTree, mockRawDraft.content, initFn)
		let obj = d.toObject()
		expect(obj).toEqual(
			expect.objectContaining({
				content: { nothing: true },
				children: [], // note DraftNode wont have children when created directly
				id: 666
			})
		)
	})

	it('yells returns an array of empty promises with no children', () => {
		let DraftNode = oboRequire('models/draft_node')
		const draftTree = {}
		let initFn = jest.fn()
		let d = new DraftNode(draftTree, mockRawDraft.content, initFn)
		let promises = d.yell()
		expect(promises).toBeInstanceOf(Array)
		expect(promises).toHaveLength(0)
	})

	it('yells to children', () => {
		expect.assertions(4)

		let Draft = oboRequire('models/draft')
		let d = new Draft(mockRawDraft.content)
		let children = d.getChildNodesByType('DraftNode')

		// mock each draftNode's yell function
		children.forEach(c => {
			c.originalYell = c.yell
			c.yell = jest.fn()
			c.yell.mockImplementation(event => {
				return c.originalYell(event) // use the orignial yell function
			})
		})

		d.yell('test')

		// make sure each draftNode.yell was called
		children.forEach(c => {
			expect(c.yell).toBeCalledWith('test')
		})
	})

	it('yell fires named event listeners', () => {
		let DraftNode = oboRequire('models/draft_node')
		const draftTree = {}
		let eventFn = jest.fn().mockImplementation(() => {
			return 5
		})
		let d = new DraftNode(draftTree, mockRawDraft.content)
		d.registerEvents({ test: eventFn })
		let promises = d.yell('test')
		expect(eventFn).toHaveBeenCalled()
	})

	it('builds childrenSet as expected', () => {
		let Draft = oboRequire('models/draft')
		let d = new Draft(mockRawDraft.content)
		let childrenSet = d.getChildNodeById(666).childrenSet
		expect(childrenSet.has(999)).toBe(true)
		expect(childrenSet.has(888)).toBe(true)
		expect(childrenSet.has(777)).toBe(true)
		expect(childrenSet.has(333)).toBe(false)
	})

	it('builds immediateChildrenSet as expected', () => {
		let Draft = oboRequire('models/draft')
		let d = new Draft(mockRawDraft.content)
		let iChildrenSet = d.getChildNodeById(666).immediateChildrenSet
		expect(iChildrenSet.has(999)).toBe(true)
		expect(iChildrenSet.has(888)).toBe(true)
		expect(iChildrenSet.has(777)).toBe(false)
		expect(iChildrenSet.has(333)).toBe(false)
	})

	it('contains finds child nodes', () => {
		let Draft = oboRequire('models/draft')
		let d = new Draft(mockRawDraft.content)
		expect(d.root.contains({ id: 999 })).toBe(true)
		expect(d.root.contains({ id: 888 })).toBe(true)
		expect(d.root.contains({ id: 777 })).toBe(true)
		expect(d.root.contains({ id: 333 })).toBe(false)
	})
})
