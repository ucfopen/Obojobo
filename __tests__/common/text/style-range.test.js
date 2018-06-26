import StyleRange from '../../../src/scripts/common/text/style-range'

describe('StyleRange', () => {
	test('constructor builds with no values', () => {
		let item = new StyleRange()

		expect(item.start).toEqual(0)
		expect(item.end).toEqual(0)
		expect(item.type).toEqual('')
		expect(item.data).toEqual({})
	})

	test('constructor builds with values', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.start).toEqual(5)
		expect(item.end).toEqual(10)
		expect(item.type).toEqual('mockType')
		expect(item.data).toEqual(17)
	})

	test('clone creates a copy', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)
		let clone = item.clone()

		expect(item).not.toBe(clone)
		expect(item).toEqual(clone)
	})

	test('getExportedObject builds an object representation', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.getExportedObject()).toEqual({
			type: 'mockType',
			start: 5,
			end: 10,
			data: 17
		})
	})

	test('toString builds a string representation', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.toString()).toEqual('mockType:5,10(17)')
	})

	test('isInvalid does not allow 0 length items', () => {
		let item = new StyleRange(1, 1)

		expect(item.isInvalid()).toEqual(true)
	})

	test('isInvalid allows 0 length items with both indexes 0', () => {
		let item = new StyleRange(0, 0)

		expect(item.isInvalid()).toEqual(false)
	})

	test('invalidate makes a range invalid', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.isInvalid()).toEqual(false)

		item.invalidate()

		expect(item.isInvalid()).toEqual(true)
	})

	test('compareToRange returns contains if shorter thaan beginning range', () => {
		let item = new StyleRange(0, 10, 'mockType', 17)

		expect(item.compareToRange(0, 6)).toBe(StyleRange.CONTAINS)
	})

	test('compareToRange returns after if item comes after range', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(0, 3)).toBe(StyleRange.AFTER)
	})

	test('compareToRange returns before if item comes before range', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(11, 13)).toBe(StyleRange.BEFORE)
	})

	test('compareToRange returns encapsulated if item is contained in range', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(0, 14)).toBe(StyleRange.ENSCAPSULATED_BY)
	})

	test('compareToRange returns contains if item contains range', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(6, 7)).toBe(StyleRange.CONTAINS)
	})

	test('compareToRange returns left if first part of range overlaps last part of item', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(6, 13)).toBe(StyleRange.INSIDE_LEFT)
	})

	test('compareToRange returns right if first part of item overlaps last part of range', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(0, 6)).toBe(StyleRange.INSIDE_RIGHT)
	})

	test('compareToRange only looks at one value if not given to', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.compareToRange(0)).toBe(StyleRange.AFTER)
	})

	test('isMergeable returns false when types are different', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.isMergeable('notMockType')).toEqual(false)
	})

	test('isMergeable returns false when data is different', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.isMergeable('mockType', 18)).toEqual(false)
	})

	test('isMergeable returns false when data objects are different', () => {
		let item = new StyleRange(5, 10, 'mockType', { a: 1, b: 2 })

		expect(item.isMergeable('mockType', { a: 1 })).toEqual(false)
	})

	test('isMergeable returns true when type and data is the same', () => {
		let item = new StyleRange(5, 10, 'mockType', 17)

		expect(item.isMergeable('mockType', 17)).toEqual(true)
	})

	test('createFromObject builds from an object', () => {
		let item = StyleRange.createFromObject({
			start: 5,
			end: 10,
			type: 'mockType',
			data: 17
		})

		expect(item.start).toEqual(5)
		expect(item.end).toEqual(10)
		expect(item.type).toEqual('mockType')
		expect(item.data).toEqual(17)
	})
})
