import MockTextNode from '../../../src/scripts/common/mockdom/mock-text-node'

describe('MockTextNode', () => {
	test('creates new instance', () => {
		const el = new MockTextNode('text goes here')

		expect(el.text).toBe('text goes here')
		expect(el.nodeType).toBe('text')
		expect(el.parent).toBe(null)
	})

	test('creates new empty node', () => {
		const el = new MockTextNode()

		expect(el.text).toBe('')
		expect(el.nodeType).toBe('text')
		expect(el.parent).toBe(null)
	})
})
