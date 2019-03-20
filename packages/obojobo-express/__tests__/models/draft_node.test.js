jest.mock('../../db')

import Draft from '../../models/draft'
import DraftNode from '../../models/draft_node'

const mockRawDraft = {
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

	test('constructor initializes expected properties', () => {
		const draftTree = {}
		const initFn = jest.fn()
		const d = new DraftNode(draftTree, mockRawDraft.content, initFn)
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

	test('init calls passed init function', () => {
		const draftTree = {}
		const initFn = jest.fn()
		const d = new DraftNode(draftTree, mockRawDraft.content, initFn)
		expect(d.init).toBe(initFn)
		d.init()
		expect(initFn).toHaveBeenCalledTimes(1)
	})

	test('get childrenSet builds childrenSet as expected', () => {
		const d = new DraftNode({}, mockRawDraft.content, jest.fn())
		d.children.push({ node: { id: 999 }, children: [{ node: { id: 777 }, children: [] }] })
		d.children.push({ node: { id: 888 }, children: [] })

		const childrenSet = d.childrenSet
		expect(childrenSet.has(999)).toBe(true)
		expect(childrenSet.has(888)).toBe(true)
		expect(childrenSet.has(777)).toBe(true)
		expect(childrenSet.has(333)).toBe(false)
	})

	test('get childrenSet throws error if child has no id', () => {
		const d = new DraftNode({}, mockRawDraft.content, jest.fn())
		d.children.push({ node: { id: 999 }, children: [{ node: { id: 777 }, children: [] }] })
		d.children.push({ node: { id: null }, children: [] })

		const getChildrenIds = () => d.childrenSet
		expect(getChildrenIds).toThrowError('Unable to add child node with missing id')
	})

	test('get immediateChildrenSet builds immediateChildrenSet as expected', () => {
		const d = new DraftNode({}, mockRawDraft.content, jest.fn())
		d.children.push({ node: { id: 999 }, children: [{ node: { id: 777 }, children: [] }] })
		d.children.push({ node: { id: 888 }, children: [] })
		const iChildrenSet = d.immediateChildrenSet
		expect(iChildrenSet.has(999)).toBe(true)
		expect(iChildrenSet.has(888)).toBe(true)
		expect(iChildrenSet.has(777)).toBe(false)
		expect(iChildrenSet.has(333)).toBe(false)
	})

	test('registerEvents sets up listeners', () => {
		const d = new DraftNode({}, mockRawDraft.content, jest.fn())
		const eventFn = jest.fn()

		d.registerEvents({ test: eventFn, test2: eventFn })

		expect(d._listeners.size).toBe(2)

		d.registerEvents({ test: eventFn, test3: eventFn })

		expect(d._listeners.size).toBe(3)
	})

	test('contains finds child nodes', () => {
		const d = new Draft(null, mockRawDraft.content)
		expect(d.root.contains({ id: 999 })).toBe(true)
		expect(d.root.contains({ id: 888 })).toBe(true)
		expect(d.root.contains({ id: 777 })).toBe(true)
		expect(d.root.contains({ id: 333 })).toBe(false)
	})

	test('yells returns an array of empty promises with no children', () => {
		const d = new DraftNode({}, mockRawDraft.content, jest.fn())
		const promises = d.yell()
		expect(promises).toBeInstanceOf(Array)
		expect(promises).toHaveLength(0)
	})

	test('yells to children', () => {
		expect.assertions(3)
		const d = new Draft(null, mockRawDraft.content)

		const node = d.getChildNodeById(666)

		// mock each draftNode's yell function
		node.children.forEach(c => {
			jest.spyOn(c, 'yell')
			c.children.forEach(child => {
				jest.spyOn(child, 'yell')
			})
		})

		node.yell('test')

		// make sure each draftNode.yell was called
		node.children.forEach(c => {
			expect(c.yell).toBeCalledWith('test')

			c.children.forEach(child => {
				expect(child.yell).toBeCalledWith('test')
			})
		})
	})

	test('yell fires named event listeners', () => {
		const draftTree = {}
		const eventFn = jest.fn().mockImplementation(() => {
			return 5
		})
		const d = new DraftNode(draftTree, mockRawDraft.content)
		d.registerEvents({ test: eventFn })
		d.yell('test')
		expect(eventFn).toHaveBeenCalled()
	})

	test('yell does not fire unnamed events', () => {
		const draftTree = {}
		const eventFn = jest.fn().mockImplementation(() => {
			return 5
		})
		const d = new DraftNode(draftTree, mockRawDraft.content)
		d.registerEvents({ test: eventFn })
		d.yell('mocktest')
		expect(eventFn).not.toHaveBeenCalled()
	})

	test('yell does not return rejected promises', () => {
		const draftTree = {}
		const eventFn = jest.fn().mockReturnValueOnce(false)
		const d = new DraftNode(draftTree, mockRawDraft.content)
		d.registerEvents({ test: eventFn })
		d.yell('test')
		expect(eventFn).toHaveBeenCalled()
	})

	test('toObject converts itself to an object', () => {
		const draftTree = {}
		const initFn = jest.fn()
		const d = new DraftNode(draftTree, mockRawDraft.content, initFn)
		d.children.push({
			toObject: jest.fn().mockReturnValueOnce({
				node: { id: 888 },
				children: []
			})
		})

		const obj = d.toObject()
		expect(obj).toEqual(
			expect.objectContaining({
				content: { nothing: true },
				children: [{ node: { id: 888 }, children: [] }],
				id: 666
			})
		)
	})
})
