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
			valueString: ''
		})
	})

	test('parse returns null parse object', () => {
		expect(Numeric.parse()).toEqual(Numeric.getNullParseObject())
	})

	test('getIsEqual checks if two Big values are equal', () => {
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			valueString: 'mockValueString'
		})
		const getBigValueFromStringSpy = jest.spyOn(Numeric, 'getBigValueFromString').mockReturnValue({
			eq: bigValue => bigValue
		})

		const result = Numeric.getIsEqual('mockString', 'mockBigValue')

		expect(result).toBe('mockBigValue')
		expect(parseSpy).toHaveBeenCalledWith('mockString')
		expect(getBigValueFromStringSpy).toHaveBeenCalledWith('mockValueString')

		parseSpy.mockRestore()
		getBigValueFromStringSpy.mockRestore()
	})

	test('getStringFromBigValue calls toString on the passed in value', () => {
		const toString = jest.fn().mockReturnValue('mock-to-string')
		expect(Numeric.getStringFromBigValue({ toString })).toBe('mock-to-string')
		expect(toString).toHaveBeenCalled()
	})

	test('isSafe returns false', () => {
		expect(Numeric.isSafe()).toBe(false)
	})

	test('getBigValueFromString returns null', () => {
		expect(Numeric.getBigValueFromString()).toBe(null)
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

	test('constructor calls getStringFromBigValue if passed in a non string and calls init', () => {
		const getStringFromBigValueSpy = jest
			.spyOn(Numeric, 'getStringFromBigValue')
			.mockReturnValue('mock-string')
		const initSpy = jest.spyOn(Numeric.prototype, 'init')

		new Numeric(null)
		expect(getStringFromBigValueSpy).toHaveBeenLastCalledWith(null)
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric(true)
		expect(getStringFromBigValueSpy).toHaveBeenLastCalledWith(true)
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric(7.5)
		expect(getStringFromBigValueSpy).toHaveBeenLastCalledWith(7.5)
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric({})
		expect(getStringFromBigValueSpy).toHaveBeenLastCalledWith({})
		expect(initSpy).toHaveBeenLastCalledWith('mock-string')

		new Numeric('passed-in-string')
		expect(getStringFromBigValueSpy).toHaveBeenCalledTimes(4)
		expect(initSpy).toHaveBeenLastCalledWith('passed-in-string')

		getStringFromBigValueSpy.mockRestore()
		initSpy.mockRestore()
	})

	test('init sets expected values', () => {
		const n = new Numeric('mock-string')
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			matchType: 'mock-match-type',
			valueString: 'mock-value-string'
		})
		const isSafeSpy = jest.spyOn(Numeric, 'isSafe').mockReturnValue(true)
		const getBigValueFromStringSpy = jest
			.spyOn(Numeric, 'getBigValueFromString')
			.mockReturnValue('mock-big-value')

		n.init('new-value')

		expect(n.inputString).toBe('new-value')
		expect(n.matchType).toBe('mock-match-type')
		expect(n.valueString).toBe('mock-value-string')
		expect(n.bigValue).toBe('mock-big-value')

		parseSpy.mockRestore()
		isSafeSpy.mockRestore()
		getBigValueFromStringSpy.mockRestore()
	})

	test('init does not set bigValue if not safe', () => {
		const n = new Numeric('mock-string')
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			matchType: 'mock-match-type',
			valueString: 'mock-value-string'
		})
		const isSafeSpy = jest.spyOn(Numeric, 'isSafe').mockReturnValue(false)
		const getBigValueFromStringSpy = jest
			.spyOn(Numeric, 'getBigValueFromString')
			.mockReturnValue('mock-big-value')

		n.init('new-value')

		expect(n.inputString).toBe('new-value')
		expect(n.matchType).toBe('mock-match-type')
		expect(n.valueString).toBe('mock-value-string')
		expect(n.bigValue).toBe(null)

		parseSpy.mockRestore()
		isSafeSpy.mockRestore()
		getBigValueFromStringSpy.mockRestore()
	})

	test('init does not set bigValue or formattedString if match type is none', () => {
		const n = new Numeric('mock-string')
		const parseSpy = jest.spyOn(Numeric, 'parse').mockReturnValue({
			matchType: 'none',
			valueString: 'mock-value-string'
		})
		const getBigValueFromStringSpy = jest.spyOn(Numeric, 'getBigValueFromString')

		n.init('new-value')

		expect(getBigValueFromStringSpy).not.toHaveBeenCalled()

		parseSpy.mockRestore()
		getBigValueFromStringSpy.mockRestore()
	})

	test('setBigValue calls init with the new value', () => {
		const n = new Numeric('mock-string')
		const spy = jest.spyOn(Numeric.prototype, 'init')

		n.setBigValue('new-value')

		expect(spy).toHaveBeenCalledWith('new-value')

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

	test('clone creates a copy with this.inputString', () => {
		const n = new Numeric('mock-string')
		const n2 = n.clone()

		expect(n).not.toBe(n2)
		expect(n).toEqual(n2)
	})

	test('toString returns this.valueString', () => {
		const n = new Numeric('mock-string')
		expect(n.toString()).toEqual(n.valueString)
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
