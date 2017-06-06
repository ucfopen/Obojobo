import MockTextNode from '../../../src/scripts/common/mockdom/mock-text-node'

describe('MockTextNode', () => {
	test('creates new instance', () => {
		let el = new MockTextNode('text goes here');

		expect(el.text).toBe('text goes here')
		expect(el.nodeType).toBe('text')
		expect(el.parent).toBe(null)
	})
})