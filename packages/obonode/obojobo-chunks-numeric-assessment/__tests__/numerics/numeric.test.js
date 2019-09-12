/* eslint-disable new-cap */
/* eslint-disable no-new */

import Numeric from '../../numerics/numeric'
import Big from 'big.js'

describe('Numeric', () => {
	test('get type returns expected type', () => {
		expect(Numeric.type).toEqual('invalid')
	})

	test('get label returns expected type', () => {
		expect(Numeric.label).toEqual('Numeric')
	})

	test('getNullParseObject returns expected value', () => {
		expect(Numeric.getNullParseObject()).toEqual({
			matchType: 'none',
			valueString: '',
			unit: ''
		})
	})

	test('parse returns null parse object', () => {
		expect(Numeric.parse()).toEqual(Numeric.getNullParseObject())
	})

	test('getIsEqual checks if two Big values are equal', () => {
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			valueString: 'mockValueString'
		})
		const getBigValueSpy = jest.spyOn(Numeric, 'getBigValue').mockReturnValue({
			eq: bigValue => bigValue
		})

		const result = Numeric.getIsEqual('mockString', 'mockBigValue')

		expect(result).toBe('mockBigValue')
		expect(parseSpy).toHaveBeenCalledWith('mockString')
		expect(getBigValueSpy).toHaveBeenCalledWith('mockValueString')

		parseSpy.mockRestore()
		getBigValueSpy.mockRestore()
	})

	test('getStringWithUnit returns the value of getString with a unit', () => {
		expect(Numeric.getStringWithUnit({ toString: () => 'mock-value' }, '')).toBe('mock-value')
		expect(Numeric.getStringWithUnit({ toString: () => 'mock-value' }, 'unit')).toBe(
			'mock-value unit'
		)
	})

	test('getString calls toString on the passed in value', () => {
		const toString = jest.fn().mockReturnValue('mock-to-string')
		expect(Numeric.getString({ toString })).toBe('mock-to-string')
		expect(toString).toHaveBeenCalled()
	})

	test('isSafe returns false', () => {
		expect(Numeric.isSafe()).toBe(false)
	})

	test('getBigValue returns null', () => {
		expect(Numeric.getBigValue()).toBe(null)
	})

	test('getRoundedBigValue returns a rounded big object', () => {
		expect(Numeric.getRoundedBigValue(Big(0))).toEqual(Big(0))
		expect(Numeric.getRoundedBigValue(Big(8.765))).toEqual(Big(8.765))
		expect(Numeric.getRoundedBigValue(Big(8.765), 6)).toEqual(Big(8.765))
		expect(Numeric.getRoundedBigValue(Big(8.765), 5)).toEqual(Big(8.765))
		expect(Numeric.getRoundedBigValue(Big(8.765), 4)).toEqual(Big(8.765))
		expect(Numeric.getRoundedBigValue(Big(8.765), 3)).toEqual(Big(8.77))
		expect(Numeric.getRoundedBigValue(Big(8.765), 2)).toEqual(Big(8.8))
		expect(Numeric.getRoundedBigValue(Big(8.765), 1)).toEqual(Big(9))
	})

	test('getNumSigFigs returns null', () => {
		expect(Numeric.getNumSigFigs()).toBe(null)
	})

	test('getIsInteger returns null', () => {
		expect(Numeric.getIsInteger()).toBe(null)
	})

	test('getNumDecimalDigits returns 0', () => {
		expect(Numeric.getNumDecimalDigits()).toBe(0)
	})

	test.each`
		unit              | isValid
		${''}             | ${true}
		${' '}            | ${true}
		${'g'}            | ${true}
		${'G'}            | ${true}
		${'grams'}        | ${true}
		${'Grams'}        | ${true}
		${'m/s^2'}        | ${true}
		${'boiled goose'} | ${true}
		${'%'}            | ${true}
		${'Ω'}            | ${true}
		${'_'}            | ${true}
		${'0'}            | ${false}
		${'2'}            | ${false}
		${'.6'}           | ${false}
		${'/2'}           | ${false}
	`(`isValidUnit($unit)=$isValid`, ({ unit, isValid }) => {
		expect(Numeric.isValidUnit(unit)).toBe(isValid)
	})

	test('constructor calls getString if passed in a non string and calls init', () => {
		const getStringSpy = jest.spyOn(Numeric, 'getString').mockReturnValue('mock-string')
		const initSpy = jest.spyOn(Numeric.prototype, 'init')

		new Numeric(null)
		expect(getStringSpy).toHaveBeenLastCalledWith(null)
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric(true)
		expect(getStringSpy).toHaveBeenLastCalledWith(true)
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric(7.5)
		expect(getStringSpy).toHaveBeenLastCalledWith(7.5)
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric({})
		expect(getStringSpy).toHaveBeenLastCalledWith({})
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric('passed-in-string')
		expect(getStringSpy).toHaveBeenCalledTimes(4)
		expect(initSpy).toHaveBeenLastCalledWith('passed-in-string')

		getStringSpy.mockRestore()
		initSpy.mockRestore()
	})

	test('init sets expected values', () => {
		const n = new Numeric('mock-string')
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			matchType: 'mock-match-type',
			unit: 'mock-unit',
			valueString: 'mock-value-string'
		})
		const getBigValueSpy = jest.spyOn(Numeric, 'getBigValue').mockReturnValue('mock-big-value')

		n.init('new-value')

		expect(n.string).toBe('new-value')
		expect(n.matchType).toBe('mock-match-type')
		expect(n.unit).toBe('mock-unit')
		expect(n.valueString).toBe('mock-value-string')
		expect(n.bigValue).toBe('mock-big-value')
		expect(n.formattedString).toBe('mock-big-value mock-unit')

		parseSpy.mockRestore()
		getBigValueSpy.mockRestore()
	})

	test('init does not set bigValue or formattedString if match type is none', () => {
		const n = new Numeric('mock-string')
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			matchType: 'none',
			unit: 'mock-unit',
			valueString: 'mock-value-string'
		})
		const getBigValueSpy = jest.spyOn(Numeric, 'getBigValue')
		const getStringWithUnitSpy = jest.spyOn(Numeric, 'getStringWithUnit')

		n.init('new-value')

		expect(getBigValueSpy).not.toHaveBeenCalled()
		expect(getStringWithUnitSpy).not.toHaveBeenCalled()

		parseSpy.mockRestore()
		getBigValueSpy.mockRestore()
		getStringWithUnitSpy.mockRestore()
	})

	test('setBigValue calls init with the new value', () => {
		const n = new Numeric('mock-string')
		n.unit = 'mock-unit'
		const spy = jest.spyOn(Numeric.prototype, 'init')

		n.setBigValue('new-value')

		expect(spy).toHaveBeenCalledWith('new-value mock-unit')

		spy.mockRestore()
	})

	test('round calls setBigValue with the new rounded value', () => {
		const n = new Numeric('mock-string')
		n.bigValue = 'mock-big-value'
		const getRoundedBigValueSpy = jest
			.spyOn(Numeric, 'getRoundedBigValue')
			.mockReturnValue('mock-rounded-value')
		const setBigValueSpy = jest.spyOn(Numeric.prototype, 'setBigValue')

		n.round(123)

		expect(getRoundedBigValueSpy).toHaveBeenCalledWith('mock-big-value', 123)
		expect(setBigValueSpy).toHaveBeenCalledWith('mock-rounded-value')

		getRoundedBigValueSpy.mockRestore()
		setBigValueSpy.mockRestore()
	})

	test('setUnit calls init with the new unit', () => {
		const n = new Numeric('mock-string')
		n.bigValue = Big(123)
		n.unit = ''

		const spy = jest.spyOn(Numeric.prototype, 'init')

		n.setUnit('mock-unit')

		expect(spy).toHaveBeenCalledWith('123 mock-unit')

		spy.mockRestore()
	})

	test('clearUnit resets unit to ""', () => {
		const n = new Numeric('mock-string')
		const spy = jest.spyOn(Numeric.prototype, 'setUnit').mockImplementation(jest.fn())

		n.clearUnit()
		expect(spy).toHaveBeenCalledWith('')

		spy.mockRestore()
	})

	test('toObject returns the expected values', () => {
		const n = new Numeric('mock-string')

		const getNumSigFigsSpy = jest
			.spyOn(Numeric, 'getNumSigFigs')
			.mockReturnValue('mock-num-sig-figs')
		const getNumDecimalDigitsSpy = jest
			.spyOn(Numeric, 'getNumDecimalDigits')
			.mockReturnValue('mock-num-decimal-digits')
		n.bigValue = 'mock-big-value'
		n.match = 'mock-match'

		expect(n.toObject()).toEqual({
			type: 'invalid',
			numSigFigs: 'mock-num-sig-figs',
			numDecimalDigits: 'mock-num-decimal-digits',
			bigValue: 'mock-big-value',
			match: 'mock-match'
		})

		getNumSigFigsSpy.mockRestore()
		getNumDecimalDigitsSpy.mockRestore()
	})

	test('toJSON returns a JSON representation', () => {
		const n = new Numeric('mock-string')

		const toObjectSpy = jest.spyOn(Numeric.prototype, 'toObject').mockReturnValue({
			mockToObject: true,
			bigValue: {
				toString: () => 'mock-to-string'
			}
		})

		expect(n.toJSON()).toEqual({
			mockToObject: true,
			bigValue: 'mock-to-string'
		})

		toObjectSpy.mockRestore()
	})

	test('clone creates a copy', () => {
		const spy = jest.spyOn(Numeric.prototype, 'getStringWithUnit').mockReturnValue('mock-string')

		const n = new Numeric('mock-string')
		const n2 = n.clone()

		expect(n).not.toBe(n2)
		expect(n).toEqual(n2)

		spy.mockRestore()
	})

	test('getString calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getString').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.getString()).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('getStringWithUnit calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getStringWithUnit').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.getStringWithUnit()).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('toString calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getStringWithUnit').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.toString()).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('isEqual calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getIsEqual').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.isEqual()).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('isSafe calls static method', () => {
		const spy = jest.spyOn(Numeric, 'isSafe').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.isSafe).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('numSigFigs calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getNumSigFigs').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.numSigFigs).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('isInteger calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getIsInteger').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.isInteger).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('isWithUnit returns true if unit is defined', () => {
		const n = new Numeric('mock-string')

		n.unit = ''
		expect(n.isWithUnit).toBe(false)

		n.unit = 'mock-unit'
		expect(n.isWithUnit).toBe(true)
	})

	test('numDecimalDigits calls static method', () => {
		const spy = jest.spyOn(Numeric, 'getNumDecimalDigits').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.numDecimalDigits).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('type calls static method', () => {
		const spy = jest.spyOn(Numeric, 'type', 'get').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.type).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('label calls static method', () => {
		const spy = jest.spyOn(Numeric, 'label', 'get').mockReturnValue('mock-return-value')

		const n = new Numeric('mock-string')
		expect(n.label).toEqual('mock-return-value')
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})
})
