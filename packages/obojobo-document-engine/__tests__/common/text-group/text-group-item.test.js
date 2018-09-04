import TextGroupItem from '../../../src/scripts/common/text-group/text-group-item'

describe('TextGroupItem', () => {
	test('constructor builds with default values', () => {
		const item = new TextGroupItem()

		expect(item).toEqual({
			data: {},
			parent: null,
			text: { styleList: { styles: [] }, value: '' }
		})
	})

	test('constructor builds with given values', () => {
		const item = new TextGroupItem('mockText', 'mockData', 'mockParent')

		expect(item).toEqual({
			data: 'mockData',
			parent: 'mockParent',
			text: 'mockText'
		})
	})

	test('clone creates a copy', () => {
		const item = new TextGroupItem()

		const clone = item.clone()

		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('clone creates a copy with a custom function', () => {
		const item = new TextGroupItem()
		const mockFunction = jest.fn()

		const clone = item.clone(mockFunction)

		expect(mockFunction).toHaveBeenCalled()
		expect(clone).not.toBe(item)
		expect(clone).toEqual(item)
	})

	test('index returns -1 with no parent', () => {
		const item = new TextGroupItem()

		expect(item.index).toEqual(-1)
	})

	test('index returns parent.indexOf(item)', () => {
		const parent = {
			indexOf: jest.fn().mockReturnValueOnce('mockIndex')
		}
		const item = new TextGroupItem('mockText', 'mockData', parent)

		expect(item.index).toEqual('mockIndex')
	})
})
