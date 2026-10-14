import findItemsWithMaxPropValue from './find-items-with-max-prop-value'

describe('findItemsWithMaxPropValue Util', () => {
	test('finds deeply nested max value', () => {
		const items = [{ nested: { value: 10 } }, { nested: { value: 20 } }, { nested: { value: 12 } }]
		const result = findItemsWithMaxPropValue(items, 'nested.value')
		expect(result).toEqual([{ nested: { value: 20 } }])
	})

	test('finds extra deeply nested max value', () => {
		const items = [
			{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 10 } } } } },
			{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 20 } } } } },
			{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 12 } } } } }
		]
		const result = findItemsWithMaxPropValue(items, 'top.upperMiddle.middle.lowerMiddle.bottom')
		expect(result).toEqual([{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 20 } } } } }])
	})

	test('finds single nested max value', () => {
		const items = [{ value: 0 }, { value: 1 }, { value: -10 }]
		const result = findItemsWithMaxPropValue(items, 'value')
		expect(result).toEqual([{ value: 1 }])
	})

	test('finds all with max value', () => {
		const items = [
			{ name: 1, value: 99 },
			{ name: 2, value: 99 },
			{ name: 3, value: 98 },
			{ name: 4, value: null }
		]
		const result = findItemsWithMaxPropValue(items, 'value')
		expect(result).toEqual([{ name: 1, value: 99 }, { name: 2, value: 99 }])
	})

	test('finds items with null when no other values exist', () => {
		const items = [{ name: 1, value: null }, { name: 2, value: null }]
		const result = findItemsWithMaxPropValue(items, 'value')
		expect(result).toEqual([{ name: 1, value: null }, { name: 2, value: null }])
	})

	test('skips items without the nested key', () => {
		const items = [{ name: 1 }, { name: 2, value: 5 }, { name: 3, value: 6 }]
		const result = findItemsWithMaxPropValue(items, 'value')
		expect(result).toEqual([{ name: 3, value: 6 }])
	})

	test('returns empty array when given empty array', () => {
		const items = []
		const result = findItemsWithMaxPropValue(items, 'value')
		expect(result).toEqual([])
	})
})
