/* eslint-disable new-cap */

import BigValueRange from '../../range/big-value-range'
import Big from 'big.js'

describe('BigValueRange', () => {
	test('Constructor creates class with expected values', () => {
		const r = new BigValueRange('[1,2]')

		expect(r.min).toBeInstanceOf(Big)
		expect(r.min).toEqual(Big(1))
		expect(r.max).toBeInstanceOf(Big)
		expect(r.max).toEqual(Big(2))
	})

	test('toJSON converts Big values to strings', () => {
		const r = new BigValueRange('[1,2]')

		expect(r.toJSON()).toEqual({
			min: '1',
			max: '2',
			isMinInclusive: true,
			isMaxInclusive: true,
			isClosed: false
		})
	})

	test('compareValues compares two Big values', () => {
		expect(BigValueRange.compareValues(Big(-1), Big(0))).toBe(-1)
		expect(BigValueRange.compareValues(Big(0), Big(-1))).toBe(1)
		expect(BigValueRange.compareValues(Big(1), Big(1))).toBe(0)
	})

	test('parseValue returns a new Big instance', () => {
		expect(BigValueRange.parseValue('3.14')).toEqual(Big('3.14'))
	})
})
