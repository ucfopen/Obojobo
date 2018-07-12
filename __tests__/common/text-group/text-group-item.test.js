import TextGroupItem from '../../../src/scripts/common/text-group/text-group-item'

describe('TextGroupItem', () => {
	test('constructor builds with default values', () => {
		let item = new TextGroupItem()

		expect(item).toEqual({
			data: {},
			parent: null,
			text: { styleList: { styles: [] }, value: '' }
		})
	})

	test('constructor builds with given values', () => {
		let item = new TextGroupItem('mockText', 'mockData', 'mockParent')

		expect(item).toEqual({
			data: 'mockData',
			parent: 'mockParent',
			text: 'mockText'
		})
	})

	test('clone creates a copy', () => {
		let item = new TextGroupItem()

		let clone = item.clone()

		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('clone creates a copy with a custom function', () => {
		let item = new TextGroupItem()
		let mockFunction = jest.fn()

		let clone = item.clone(mockFunction)

		expect(mockFunction).toHaveBeenCalled()
		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('index returns -1 with no parent', () => {
		let item = new TextGroupItem()

		expect(item.index).toEqual(-1)
	})

	test('index returns parent.indexOf(item)', () => {
		let parent = {
			indexOf: jest.fn().mockReturnValueOnce('mockIndex')
		}
		let item = new TextGroupItem('mockText', 'mockData', parent)

		expect(item.index).toEqual('mockIndex')
	})
})
