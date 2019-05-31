import Percent from '../percent.js'
import Decimal from '../decimal.js'
import Big from 'big.js'
import { percentRegex } from '../input-regexes.js'

jest.mock('../input-regexes.js', () => {
	return {
		percentRegex: {
			test: jest.fn()
		}
	}
})

jest.mock('../percent-error.js')

describe('Percent', () => {
	test('get type returns expected type', () => {
		expect(Percent.type).toEqual('percent')
	})

	test('isSafe returns true', () => {
		expect(Percent.isSafe()).toBe(true)
	})

	test('getIsInteger calls Decimal.getIsInteger', () => {
		expect(Percent.getIsInteger('100%')).toEqual(Decimal.getIsInteger('1'))
		expect(Percent.getIsInteger('99999%')).toEqual(Decimal.getIsInteger('999.99'))
		expect(Percent.getIsInteger('101.1%')).toEqual(Decimal.getIsInteger('1.011'))
		expect(Percent.getIsInteger('5.67%')).toEqual(Decimal.getIsInteger('0.0567'))
	})

	test('getNumSigFigs calls Decimal.getNumSigFigs', () => {
		expect(Percent.getNumSigFigs('100%')).toEqual(Decimal.getNumSigFigs('1'))
		expect(Percent.getNumSigFigs('99999%')).toEqual(Decimal.getNumSigFigs('999.99'))
		expect(Percent.getNumSigFigs('101.1%')).toEqual(Decimal.getNumSigFigs('1.011'))
		expect(Percent.getNumSigFigs('5.67%')).toEqual(Decimal.getNumSigFigs('0.0567'))
	})

	test('getDecimalPrecision calls Decimal.getDecimalPrecision', () => {
		expect(Percent.getDecimalPrecision('100%')).toEqual(Decimal.getDecimalPrecision('1'))
		expect(Percent.getDecimalPrecision('99999%')).toEqual(Decimal.getDecimalPrecision('999.99'))
		expect(Percent.getDecimalPrecision('101.1%')).toEqual(Decimal.getDecimalPrecision('1.011'))
		expect(Percent.getDecimalPrecision('5.67%')).toEqual(Decimal.getDecimalPrecision('0.0567'))
	})

	test('getMatchType returns the correct match type', () => {
		percentRegex.test.mockReturnValue(false)
		expect(Percent.getMatchType()).toBe('none')

		percentRegex.test.mockReturnValue(true)
		expect(Percent.getMatchType()).toBe('exact')
	})

	test('getBigValue returns the bigValue property from terms', () => {
		expect(Percent.getBigValue('0%')).toEqual(Big(0))
		expect(Percent.getBigValue('-20%')).toEqual(Big(-0.2))
		expect(Percent.getBigValue('1%')).toEqual(Big(0.01))
		expect(Percent.getBigValue('100%')).toEqual(Big(1))
		expect(Percent.getBigValue('987654321%')).toEqual(Big(9876543.21))
		expect(Percent.getBigValue('99.99%')).toEqual(Big(0.9999))
	})

	test('getString returns a percent string of a Big value', () => {
		expect(Percent.getString(Big(0))).toBe('0%')
		expect(Percent.getString(Big(-0.2))).toBe('-20%')
		expect(Percent.getString(Big(0.01))).toBe('1%')
		expect(Percent.getString(Big(1))).toBe('100%')
		expect(Percent.getString(Big(9876543.21))).toBe('987654321%')
		expect(Percent.getString(Big(0.9999))).toBe('99.99%')
	})
})
