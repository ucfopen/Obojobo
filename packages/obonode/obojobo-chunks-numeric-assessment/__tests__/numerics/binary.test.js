/* eslint-disable new-cap */

import Binary from '../../numerics/binary'
import Decimal from '../../numerics/decimal'
import Big from 'big.js'
import Numeric from '../../numerics/numeric'

describe('Binary', () => {
	test('get type returns expected type', () => {
		expect(Binary.type).toEqual('binary')
	})

	test('get label returns the expected label', () => {
		expect(Binary.label).toEqual('Binary')
	})

	test.each`
		input       | expected
		${'0b0'}    | ${'binaryZeroB'}
		${'0b1'}    | ${'binaryZeroB'}
		${'0b1011'} | ${'binaryZeroB'}
		${'0'}      | ${'binaryInferred'}
		${'1'}      | ${'binaryInferred'}
		${'1011'}   | ${'binaryInferred'}
		${'0b2'}    | ${null}
		${'2'}      | ${null}
	`(`getInputType($input)=$expected`, ({ input, expected }) => {
		expect(Binary.getInputType(input)).toBe(expected)
	})

	test.each`
		input       | expected
		${'0b0'}    | ${'0b0'}
		${'0b1'}    | ${'0b1'}
		${'0b1011'} | ${'0b1011'}
		${'0'}      | ${'0'}
		${'1'}      | ${'1'}
		${'1011'}   | ${'1011'}
		${'0b2'}    | ${null}
		${'2'}      | ${null}
	`(`getValueString($input)=$expected`, ({ input, expected }) => {
		expect(Binary.getValueString(input)).toBe(expected)
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
		${'0b0'}        | ${'exact'}    | ${'0b0'}
		${'0b1'}        | ${'exact'}    | ${'0b1'}
		${'0b1011'}     | ${'exact'}    | ${'0b1011'}
		${'0'}          | ${'inferred'} | ${'0'}
		${'1'}          | ${'inferred'} | ${'1'}
		${'1011'}       | ${'inferred'} | ${'1011'}
		${'0b2'}        | ${'none'}     | ${''}
		${'2'}          | ${'none'}     | ${''}
		${'-0b0'}       | ${'none'}     | ${''}
		${'-0'}         | ${'none'}     | ${''}
		${'-0b0'}       | ${'none'}     | ${''}
		${'-0'}         | ${'none'}     | ${''}
		${'0o0'}        | ${'none'}     | ${''}
		${'0o1'}        | ${'none'}     | ${''}
		${'0o7'}        | ${'none'}     | ${''}
		${'0o8'}        | ${'none'}     | ${''}
		${'0o777'}      | ${'none'}     | ${''}
		${'0o781'}      | ${'none'}     | ${''}
		${'7'}          | ${'none'}     | ${''}
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
		expect(Binary.parse(input)).toEqual({ matchType, valueString })
	})

	test('parse returns a null parse object if unit is invalid', () => {
		expect(Binary.parse('0b0 /5')).toEqual(Numeric.getNullParseObject())
	})

	/////

	test.each`
		input                                                         | isSafe
		${'0b11111111111111111111111111111111111111111111111111110'}  | ${true}
		${'0b11111111111111111111111111111111111111111111111111111'}  | ${true}
		${'0b100000000000000000000000000000000000000000000000000000'} | ${false}
	`(`isSafe($input)=$isSafe`, ({ input, isSafe }) => {
		expect(Binary.isSafe(input)).toBe(isSafe)
	})

	test('getMatchType returns the format type', () => {
		const spy = jest.spyOn(Binary, 'getInputType').mockImplementation(jest.fn())

		spy.mockReturnValue('binaryZeroB')
		expect(Binary.getMatchType('mock-string')).toBe('exact')

		spy.mockReturnValue('binaryInferred')
		expect(Binary.getMatchType('mock-string')).toBe('inferred')

		spy.mockReturnValue('someOtherValue')
		expect(Binary.getMatchType('mock-string')).toBe('none')

		spy.mockRestore()
	})

	test.each`
		input | expected
		${0}  | ${'0b0'}
		${1}  | ${'0b1'}
		${2}  | ${'0b10'}
		${3}  | ${'0b11'}
		${42} | ${'0b101010'}
	`(`getString($input)=$expected`, ({ input, expected }) => {
		expect(Binary.getString(Big(input))).toBe(expected)
	})

	test('getBigValueFromString returns a Big instance of Binary.getValue', () => {
		expect(Binary.getBigValueFromString('0b101010')).toEqual(Big(0b101010))
	})

	test('getNumberFromString returns the number of a given string', () => {
		expect(Binary.getNumberFromString('0b101010')).toBe(42)
		expect(Binary.getNumberFromString('101010')).toBe(42)
	})

	test('getNumSigFigs calls Decimal.getNumSigFigs', () => {
		const mockString = jest.fn()
		const getBigValueFromStringSpy = jest.spyOn(Binary, 'getBigValueFromString').mockReturnValue({
			toString: () => mockString
		})
		const decimalSpy = jest.spyOn(Decimal, 'getNumSigFigs').mockImplementation(i => i)

		const result = Binary.getNumSigFigs('mock-string')

		expect(getBigValueFromStringSpy).toHaveBeenCalledWith('mock-string')
		expect(result).toBe(mockString)

		getBigValueFromStringSpy.mockRestore()
		decimalSpy.mockRestore()
	})

	test('getIsInteger returns true', () => {
		expect(Binary.getIsInteger()).toBe(true)
	})

	test('getNumDecimalDigits returns 0', () => {
		expect(Binary.getNumDecimalDigits('0b10')).toBe(0)
		expect(Binary.getNumDecimalDigits()).toBe(0)
	})
})
