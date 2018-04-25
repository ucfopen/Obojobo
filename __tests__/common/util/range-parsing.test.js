let {
	getParsedRange,
	getParsedRangeFromSingleValue,
	tryGetParsedFloat,
	isValueInRange
} = require('../../../src/scripts/common/util/range-parsing')

describe('range-parsing', () => {
	test('getParsedRange returns null if range is undefined or null', () => {
		expect(getParsedRange()).toBe(null)
		expect(getParsedRange(undefined)).toBe(null)
		expect(getParsedRange(null)).toBe(null)
	})

	test('getParsedRange calls getParsedRangeFromSingleValue', () => {
		expect(getParsedRange('1')).toEqual(getParsedRangeFromSingleValue('1'))
	})

	test('getParsedRange returns expected object for ranges', () => {
		expect(getParsedRange('[1,3]')).toEqual({
			min: '1',
			isMinInclusive: true,
			max: '3',
			isMaxInclusive: true
		})

		expect(getParsedRange('(1,3]')).toEqual({
			min: '1',
			isMinInclusive: false,
			max: '3',
			isMaxInclusive: true
		})

		expect(getParsedRange('[1,3)')).toEqual({
			min: '1',
			isMinInclusive: true,
			max: '3',
			isMaxInclusive: false
		})

		expect(getParsedRange('(1,3)')).toEqual({
			min: '1',
			isMinInclusive: false,
			max: '3',
			isMaxInclusive: false
		})

		expect(getParsedRange('[pizza,ice-cream]')).toEqual({
			min: 'pizza',
			isMinInclusive: true,
			max: 'ice-cream',
			isMaxInclusive: true
		})
	})

	test('getParsedRangeFromSingleValue returns expected object', () => {
		expect(getParsedRange('1')).toEqual({
			min: '1',
			isMinInclusive: true,
			max: '1',
			isMaxInclusive: true
		})
	})

	test('tryGetParsedFloat parses number as float', () => {
		expect(tryGetParsedFloat('56')).toBe(56)
		expect(tryGetParsedFloat('56.78')).toBe(56.78)
	})

	test('tryGetParsedFloat replaces value with replaceDict', () => {
		expect(
			tryGetParsedFloat('replace-me-too', {
				'replace-me': 1234,
				'replace-me-too': 5678
			})
		).toBe(5678)

		expect(
			tryGetParsedFloat('20', {
				'20': 21
			})
		).toBe(21)
	})

	test('tryGetParsedFloat returns value if value is included in nonParsedValues', () => {
		expect(tryGetParsedFloat(null, null, [null])).toBe(null)
		expect(tryGetParsedFloat('50', null, ['50'])).toBe('50')

		// '50' is replaced by 'fifty' and 'fifty' is not parsed:
		expect(tryGetParsedFloat('50', { '50': 'fifty' }, ['fifty'])).toBe('fifty')

		expect(tryGetParsedFloat(undefined, null, [null, undefined])).toBe(undefined)
		expect(tryGetParsedFloat(null, null, [null, undefined])).toBe(null)
	})

	test('tryGetParsedFloat allows nonParsedValues to be a single value rather than an array', () => {
		expect(tryGetParsedFloat(null, null, [null])).toBe(tryGetParsedFloat(null, null, null))
		expect(tryGetParsedFloat('50', null, ['50'])).toBe(tryGetParsedFloat('50', null, '50'))
		expect(tryGetParsedFloat('50', { '50': 'fifty' }, ['fifty'])).toBe(
			tryGetParsedFloat('50', { '50': 'fifty' }, 'fifty')
		)
	})

	test('tryGetParsedFloat will throw an error if the value can not be parsed', () => {
		expect(tryGetParsedFloat.bind(null, null)).toThrow(
			'Unable to parse "null": Got "NaN" - Unsure how to proceed'
		)
		expect(tryGetParsedFloat.bind(null, undefined)).toThrow(
			'Unable to parse "undefined": Got "NaN" - Unsure how to proceed'
		)
		expect(tryGetParsedFloat.bind(null, 'some-string')).toThrow(
			'Unable to parse "some-string": Got "NaN" - Unsure how to proceed'
		)
	})

	test('isValueInRange returns if value is within a given range', () => {
		expect(isValueInRange(50, getParsedRange('50'))).toBe(true)
		expect(isValueInRange(50, getParsedRange('(50,51)'))).toBe(false)
		expect(isValueInRange(50, getParsedRange('[50,51]'))).toBe(true)
		expect(isValueInRange(51, getParsedRange('[50,51]'))).toBe(true)
		expect(isValueInRange(51, getParsedRange('[50,51)'))).toBe(false)
		expect(
			isValueInRange(50, getParsedRange('fifty'), {
				fifty: 50
			})
		).toBe(true)
		expect(
			isValueInRange(50, getParsedRange('[one,eighty]'), {
				one: 1,
				eighty: 80
			})
		).toBe(true)
		expect(isValueInRange(Infinity, getParsedRange('[-Infinity,Infinity]'))).toBe(true)
		expect(isValueInRange(0, getParsedRange('[-Infinity,Infinity]'))).toBe(true)
		expect(isValueInRange(-20, getParsedRange('[-20,20]'))).toBe(true)
	})

	test('isValueInRange returns false if null is given for a range', () => {
		expect(isValueInRange(0, null)).toBe(false)
	})
})
