/* eslint-disable new-cap */

import Octal from '../../numerics/octal'
import Decimal from '../../numerics/decimal'
import Big from 'big.js'

describe('Octal', () => {
	test('get type returns expected type', () => {
		expect(Octal.type).toEqual('octal')
	})

	test('get label returns the expected label', () => {
		expect(Octal.label).toEqual('Octal')
	})

	test.each`
		input      | expected
		${'0o0'}   | ${'octalZeroO'}
		${'0o1'}   | ${'octalZeroO'}
		${'0o777'} | ${'octalZeroO'}
		${'0o8'}   | ${null}
		${'0'}     | ${'octalInferred'}
		${'1'}     | ${'octalInferred'}
		${'7'}     | ${'octalInferred'}
		${'777'}   | ${'octalInferred'}
		${'8'}     | ${null}
	`(`getInputType($input)=$expected`, ({ input, expected }) => {
		expect(Octal.getInputType(input)).toBe(expected)
	})

	test.each`
		input      | expected
		${'0o0'}   | ${'0o0'}
		${'0o1'}   | ${'0o1'}
		${'0o777'} | ${'0o777'}
		${'0'}     | ${'0'}
		${'1'}     | ${'1'}
		${'777'}   | ${'777'}
		${'0o2'}   | ${'0o2'}
		${'2'}     | ${'2'}
	`(`getValueString($input)=$expected`, ({ input, expected }) => {
		expect(Octal.getValueString(input)).toBe(expected)
	})
	////

	test.each`
		input           | matchType     | valueString
		${'0'}          | ${'inferred'} | ${'0'}
		${'000000'}     | ${'inferred'} | ${'000000'}
		${'0.'}         | ${'none'}     | ${''}
		${'+.0'}        | ${'none'}     | ${''}
		${'-.2'}        | ${'none'}     | ${''}
		${'1/2'}        | ${'none'}     | ${''}
		${'0/2'}        | ${'none'}     | ${''}
		${'6.6/6'}      | ${'none'}     | ${''}
		${'+33/22'}     | ${'none'}     | ${''}
		${'-0/0'}       | ${'none'}     | ${''}
		${'6.02e23'}    | ${'none'}     | ${''}
		${'60.2e23'}    | ${'none'}     | ${''}
		${'6.02e2.3'}   | ${'none'}     | ${''}
		${'60.2x10^23'} | ${'none'}     | ${''}
		${'6*10^23'}    | ${'none'}     | ${''}
		${"-6.02'23"}   | ${'none'}     | ${''}
		${'-6.02ee-23'} | ${'none'}     | ${''}
		${'0b0'}        | ${'none'}     | ${''}
		${'0b1'}        | ${'none'}     | ${''}
		${'0b1011'}     | ${'none'}     | ${''}
		${'0'}          | ${'inferred'} | ${'0'}
		${'1'}          | ${'inferred'} | ${'1'}
		${'1011'}       | ${'inferred'} | ${'1011'}
		${'0b2'}        | ${'none'}     | ${''}
		${'2'}          | ${'inferred'} | ${'2'}
		${'-0b0'}       | ${'none'}     | ${''}
		${'-0'}         | ${'none'}     | ${''}
		${'0o0'}        | ${'exact'}    | ${'0o0'}
		${'0o1'}        | ${'exact'}    | ${'0o1'}
		${'0o7'}        | ${'exact'}    | ${'0o7'}
		${'0o8'}        | ${'none'}     | ${''}
		${'0o777'}      | ${'exact'}    | ${'0o777'}
		${'0o781'}      | ${'none'}     | ${''}
		${'7'}          | ${'inferred'} | ${'7'}
		${'8'}          | ${'none'}     | ${''}
		${'0x0'}        | ${'none'}     | ${''}
		${'0x0F'}       | ${'none'}     | ${''}
		${'0xfa'}       | ${'none'}     | ${''}
		${'-0xfa'}      | ${'none'}     | ${''}
		${'+0xfa'}      | ${'none'}     | ${''}
		${'0xG6'}       | ${'none'}     | ${''}
		${'#0'}         | ${'none'}     | ${''}
		${'#DEADBEEF'}  | ${'none'}     | ${''}
		${'#692B'}      | ${'none'}     | ${''}
		${'-#692B'}     | ${'none'}     | ${''}
		${'+#692B'}     | ${'none'}     | ${''}
		${'#ZAP'}       | ${'none'}     | ${''}
		${'$0'}         | ${'none'}     | ${''}
		${'$CCC'}       | ${'none'}     | ${''}
		${'$bAdFaD'}    | ${'none'}     | ${''}
		${'-$bAdFaD'}   | ${'none'}     | ${''}
		${'+$bAdFaD'}   | ${'none'}     | ${''}
		${'$HEX'}       | ${'none'}     | ${''}
		${'B'}          | ${'none'}     | ${''}
		${'0F'}         | ${'none'}     | ${''}
		${'F0'}         | ${'none'}     | ${''}
		${'-F0'}        | ${'none'}     | ${''}
		${'+F0'}        | ${'none'}     | ${''}
		${'999A999'}    | ${'none'}     | ${''}
		${'999H999'}    | ${'none'}     | ${''}
		${'0'}          | ${'inferred'} | ${'0'}
		${'6928'}       | ${'none'}     | ${''}
		${'-6928'}      | ${'none'}     | ${''}
		${'+6928'}      | ${'none'}     | ${''}
	`(`parse($input)={$matchType,$valueString}`, ({ input, matchType, valueString }) => {
		expect(Octal.parse(input)).toEqual({ matchType, valueString })
	})

	/////

	test.each`
		input                     | isSafe
		${'0o77777777777777777'}  | ${true}
		${'0o700000000000000000'} | ${false}
	`(`isSafe($input)=$isSafe`, ({ input, isSafe }) => {
		expect(Octal.isSafe(input)).toBe(isSafe)
	})

	test('getMatchType returns the format type', () => {
		const spy = jest.spyOn(Octal, 'getInputType').mockImplementation(jest.fn())

		spy.mockReturnValue('octalZeroO')
		expect(Octal.getMatchType('mock-string')).toBe('exact')

		spy.mockReturnValue('octalInferred')
		expect(Octal.getMatchType('mock-string')).toBe('inferred')

		spy.mockReturnValue('someOtherValue')
		expect(Octal.getMatchType('mock-string')).toBe('none')

		spy.mockRestore()
	})

	test.each`
		input  | expected
		${0}   | ${'0o0'}
		${1}   | ${'0o1'}
		${7}   | ${'0o7'}
		${8}   | ${'0o10'}
		${42}  | ${'0o52'}
		${511} | ${'0o777'}
		${512} | ${'0o1000'}
	`(`getString($input)=$expected`, ({ input, expected }) => {
		expect(Octal.getString(Big(input))).toBe(expected)
	})

	test('getBigValueFromString returns a Big instance of Octal.getValue', () => {
		expect(Octal.getBigValueFromString('0o777')).toEqual(Big(0o777))
	})

	test('getNumberFromString returns the number of a given string', () => {
		expect(Octal.getNumberFromString('0o52')).toBe(42)
		expect(Octal.getNumberFromString('52')).toBe(42)
	})

	test('getNumSigFigs calls Decimal.getNumSigFigs', () => {
		const mockString = jest.fn()
		const getBigValueFromStringSpy = jest.spyOn(Octal, 'getBigValueFromString').mockReturnValue({
			toString: () => mockString
		})
		const decimalSpy = jest.spyOn(Decimal, 'getNumSigFigs').mockImplementation(i => i)

		const result = Octal.getNumSigFigs('mock-string')

		expect(getBigValueFromStringSpy).toHaveBeenCalledWith('mock-string')
		expect(result).toBe(mockString)

		getBigValueFromStringSpy.mockRestore()
		decimalSpy.mockRestore()
	})

	test('getIsInteger returns true', () => {
		expect(Octal.getIsInteger()).toBe(true)
	})

	test('getNumDecimalDigits returns 0', () => {
		expect(Octal.getNumDecimalDigits('0o777')).toBe(0)
		expect(Octal.getNumDecimalDigits()).toBe(0)
	})
})
