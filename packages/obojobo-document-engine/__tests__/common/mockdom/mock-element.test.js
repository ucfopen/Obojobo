import MockElement from '../../../src/scripts/common/mockdom/mock-element'

describe('MockElement', () => {
	beforeEach(() => {
		// jest.resetAllMocks()
		// AssessmentStore.init()
		// QuestionStore.init()
	})

	test('creates new instance', () => {
		let el = new MockElement('type', { a: 1 })

		expect(el.type).toBe('type')
		expect(el.attrs).toEqual({ a: 1 })
		expect(el.nodeType).toBe('element')
		expect(el.children).toEqual([])
		expect(el.parent).toBe(null)
	})

	test('adds child', () => {
		let root = new MockElement('root')
		let child = new MockElement('child')

		root.addChild(child)

		expect(root.parent).toBe(null)
		expect(root.children).toEqual([child])
		expect(child.parent).toBe(root)
		expect(child.children).toEqual([])
	})

	test('addChildAt adds child at index', () => {
		let root = new MockElement('root')
		let childA = new MockElement('child-a')
		let childB = new MockElement('child-b')
		let childC = new MockElement('child-c')
		let childD = new MockElement('child-d')

		root.addChildAt(childA, 0)

		expect(root.children).toEqual([childA])

		root.addChildAt(childB, 0)

		expect(root.children).toEqual([childB, childA])

		root.addChildAt(childC, 1)

		expect(root.children).toEqual([childB, childC, childA])

		root.addChildAt(childD, 3)

		expect(root.children).toEqual([childB, childC, childA, childD])
	})

	test('addBefore adds a child before another child', () => {
		let root = new MockElement('root')
		let childA = new MockElement('child-a')
		let childB = new MockElement('child-b')
		let childC = new MockElement('child-c')

		root.addChild(childA)
		root.addBefore(childB, childA)

		expect(root.children).toEqual([childB, childA])

		root.addBefore(childC, childA)

		expect(root.children).toEqual([childB, childC, childA])
	})

	test('addAfter adds a child after another child', () => {
		let root = new MockElement('root')
		let childA = new MockElement('child-a')
		let childB = new MockElement('child-b')
		let childC = new MockElement('child-c')

		root.addChild(childA)
		root.addAfter(childB, childA)

		expect(root.children).toEqual([childA, childB])

		root.addAfter(childC, childA)

		expect(root.children).toEqual([childA, childC, childB])
	})

	test('replaceChild will replace a child with another child', () => {
		let root = new MockElement('root')
		let childA = new MockElement('child-a')
		let childB = new MockElement('child-b')

		root.addChild(childA)
		root.replaceChild(childA, childB)

		expect(root.children).toEqual([childB])
	})

	test('firstChild and lastChild return the first and last children', () => {
		let root = new MockElement('root')
		let childA = new MockElement('child-a')
		let childB = new MockElement('child-b')
		let childC = new MockElement('child-c')

		root.addChild(childA)
		root.addChild(childB)
		root.addChild(childC)

		expect(root.firstChild).toBe(childA)
		expect(root.lastChild).toBe(childC)
	})
})
