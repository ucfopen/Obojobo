import findItemsWithMaxPropValue from '../../../src/scripts/common/util/find-items-with-max-prop-updated'

describe('findItemsWithMaxPropValue Util', () => {
	test('finds deeply nested max updated', () => {
		const items = [{ nested: { updated: 10 } }, { nested: { updated: 20 } }, { nested: { updated: 12 } }]
		const result = findItemsWithMaxPropValue(items, 'nested.updated')
		expect(result).toEqual([{ nested: { updated: 20 } }])
	})

	test('finds extra deeply nested max updated', () => {
		const items = [
			{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 10 } } } } },
			{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 20 } } } } },
			{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 12 } } } } }
		]
		const result = findItemsWithMaxPropValue(items, 'top.upperMiddle.middle.lowerMiddle.bottom')
		expect(result).toEqual([{ top: { upperMiddle: { middle: { lowerMiddle: { bottom: 20 } } } } }])
	})

	test('finds single nested max updated', () => {
		const items = [{ updated: 0 }, { updated: 1 }, { updated: -10 }]
		const result = findItemsWithMaxPropValue(items, 'updated')
		expect(result).toEqual([{ updated: 1 }])
	})

	test('finds all with max updated', () => {
		const items = [
			{ name: 1, updated: 99 },
			{ name: 2, updated: 99 },
			{ name: 3, updated: 98 },
			{ name: 4, updated: null }
		]
		const result = findItemsWithMaxPropValue(items, 'updated')
		expect(result).toEqual([{ name: 1, updated: 99 }, { name: 2, updated: 99 }])
	})

	test('finds items with null when no other values exist', () => {
		const items = [{ name: 1, updated: null }, { name: 2, updated: null }]
		const result = findItemsWithMaxPropValue(items, 'updated')
		expect(result).toEqual([{ name: 1, updated: null }, { name: 2, updated: null }])
	})

	test('skips items without the nested key', () => {
		const items = [{ name: 1 }, { name: 2, updated: 5 }, { name: 3, updated: 6 }]
		const result = findItemsWithMaxPropValue(items, 'updated')
		expect(result).toEqual([{ name: 3, updated: 6 }])
	})

	test('returns empty array when given empty array', () => {
		const items = []
		const result = findItemsWithMaxPropValue(items, 'updated')
		expect(result).toEqual([])
	})
})
