import Decimal from '../decimal.js'
import Big from 'big.js'
import { decimalRegex } from '../input-regexes.js'

jest.mock('../input-regexes.js', () => {
	return {
		decimalRegex: {
			test: jest.fn()
		}
	}
})

describe('Decimal', () => {
	test('get type returns expected type', () => {
		expect(Decimal.type).toEqual('decimal')
	})

	test('isType returns true if the string input is a decimal value', () => {
		//@TODO
	})

	test('getMatchType returns the correct match type', () => {
		decimalRegex.test.mockReturnValue(false)
		expect(Decimal.getMatchType()).toBe('none')

		decimalRegex.test.mockReturnValue(true)
		expect(Decimal.getMatchType()).toBe('exact')
	})

	test('getBigValue returns a Big object', () => {
		expect(Decimal.getBigValue('-2.3')).toEqual(Big(-2.3))
		expect(Decimal.getBigValue('2.')).toEqual(Big(2))
	})

	test('getString returns a decimal string of a Big object', () => {
		expect(Decimal.getString(Big(0))).toBe('0')
		expect(Decimal.getString(Big(0.1))).toBe('0.1')
		expect(Decimal.getString(Big(-0.1))).toBe('-0.1')
		expect(Decimal.getString(Big(20))).toBe('20')
		expect(Decimal.getString(Big(-20))).toBe('-20')
		expect(Decimal.getString(Big(20.002))).toBe('20.002')
		expect(Decimal.getString(Big(-20.002))).toBe('-20.002')
		const bigString =
			'9999999999999999999999999999999999999999.8888888888888888888888888888888888888888'
		expect(Decimal.getString(Big(bigString))).toBe(bigString)
	})

	test('getNumSigFigs returns the correct number of significant figures', () => {
		const f = Decimal.getNumSigFigs

		expect(f('2')).toBe(1)
		expect(f('-2')).toBe(1)
		expect(f('+2')).toBe(1)
		expect(f('2.0')).toBe(2)
		expect(f('-2.0')).toBe(2)
		expect(f('+2.0')).toBe(2)
		expect(f('20')).toBe(1)
		expect(f('-20')).toBe(1)
		expect(f('+20')).toBe(1)
		expect(f('20.')).toBe(2)
		expect(f('-20.')).toBe(2)
		expect(f('+20.')).toBe(2)
		expect(f('20.0')).toBe(3)
		expect(f('-20.0')).toBe(3)
		expect(f('+20.0')).toBe(3)
		expect(f('20.02')).toBe(4)
		expect(f('-20.02')).toBe(4)
		expect(f('+20.02')).toBe(4)
		expect(f('020.02')).toBe(4)
		expect(f('-020.02')).toBe(4)
		expect(f('+020.02')).toBe(4)
		expect(f('08020.0280')).toBe(8)
		expect(f('-08020.0280')).toBe(8)
		expect(f('+08020.0280')).toBe(8)
	})

	test('getDecimalPrecision returns the correct decimal precision', () => {
		const f = Decimal.getDecimalPrecision

		expect(f('2')).toBe(1)
		expect(f('-2')).toBe(1)
		expect(f('+2')).toBe(1)
		expect(f('2.0')).toBe(1)
		expect(f('-2.0')).toBe(1)
		expect(f('+2.0')).toBe(1)
		expect(f('20')).toBe(2)
		expect(f('-20')).toBe(2)
		expect(f('+20')).toBe(2)
		expect(f('20.')).toBe(2)
		expect(f('-20.')).toBe(2)
		expect(f('+20.')).toBe(2)
		expect(f('20.0')).toBe(2)
		expect(f('-20.0')).toBe(2)
		expect(f('+20.0')).toBe(2)
		expect(f('20.02')).toBe(4)
		expect(f('-20.02')).toBe(4)
		expect(f('+20.02')).toBe(4)
		expect(f('020.02')).toBe(4)
		expect(f('-020.02')).toBe(4)
		expect(f('+020.02')).toBe(4)
		expect(f('08020.0280')).toBe(7)
		expect(f('-08020.0280')).toBe(7)
		expect(f('+08020.0280')).toBe(7)
	})
})
