/* eslint-disable new-cap */

import Hexadecimal from '../../numerics/hexadecimal'
import Decimal from '../../numerics/decimal'
import Big from 'big.js'

describe('Hexadecimal', () => {
	test('get type returns expected type', () => {
		expect(Hexadecimal.type).toEqual('hex')
	})

	test('get label returns the expected label', () => {
		expect(Hexadecimal.label).toEqual('Hexadecimal')
	})

	test.each`
		input          | expected
		${'0x0'}       | ${'hexZeroX'}
		${'0x0F'}      | ${'hexZeroX'}
		${'0xFA'}      | ${'hexZeroX'}
		${'-0xFA'}     | ${null}
		${'+0xFA'}     | ${null}
		${'0xG6'}      | ${null}
		${'#0'}        | ${'hexOctothorpe'}
		${'#DEADBEEF'} | ${'hexOctothorpe'}
		${'#692B'}     | ${'hexOctothorpe'}
		${'-#692B'}    | ${null}
		${'+#692B'}    | ${null}
		${'#ZAP'}      | ${null}
		${'$0'}        | ${'hexDollarSign'}
		${'$CCC'}      | ${'hexDollarSign'}
		${'$bAdFaD'}   | ${'hexDollarSign'}
		${'-$bAdFaD'}  | ${null}
		${'+$bAdFaD'}  | ${null}
		${'$HEX'}      | ${null}
		${'B'}         | ${'hexNoPrefix'}
		${'0F'}        | ${'hexNoPrefix'}
		${'F0'}        | ${'hexNoPrefix'}
		${'-F0'}       | ${null}
		${'+F0'}       | ${null}
		${'999A999'}   | ${'hexNoPrefix'}
		${'999H999'}   | ${null}
		${'0'}         | ${'hexInferred'}
		${'6928'}      | ${'hexInferred'}
		${'-6928'}     | ${null}
		${'+6928'}     | ${null}
	`(`getInputType($input)=$expected`, ({ input, expected }) => {
		expect(Hexadecimal.getInputType(input)).toBe(expected)
	})

	test.each`
		input          | expected
		${'0x0'}       | ${'0x0'}
		${'0x0F'}      | ${'0x0F'}
		${'0xfa'}      | ${'0xfa'}
		${'-0xfa'}     | ${null}
		${'+0xfa'}     | ${null}
		${'0xG6'}      | ${null}
		${'#0'}        | ${'#0'}
		${'#DEADBEEF'} | ${'#DEADBEEF'}
		${'#692B'}     | ${'#692B'}
		${'-#692B'}    | ${null}
		${'+#692B'}    | ${null}
		${'#ZAP'}      | ${null}
		${'$0'}        | ${'$0'}
		${'$CCC'}      | ${'$CCC'}
		${'$bAdFaD'}   | ${'$bAdFaD'}
		${'-$bAdFaD'}  | ${null}
		${'+$bAdFaD'}  | ${null}
		${'$HEX'}      | ${null}
		${'B'}         | ${'B'}
		${'0F'}        | ${'0F'}
		${'F0'}        | ${'F0'}
		${'-F0'}       | ${null}
		${'+F0'}       | ${null}
		${'999A999'}   | ${'999A999'}
		${'999H999'}   | ${null}
		${'0'}         | ${'0'}
		${'6928'}      | ${'6928'}
		${'-6928'}     | ${null}
		${'+6928'}     | ${null}
	`(`getValueString($input)=$expected`, ({ input, expected }) => {
		expect(Hexadecimal.getValueString(input)).toBe(expected)
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
		${'0b0'}        | ${'inferred'} | ${'0b0'}
		${'0b1'}        | ${'inferred'} | ${'0b1'}
		${'0b1011'}     | ${'inferred'} | ${'0b1011'}
		${'0'}          | ${'inferred'} | ${'0'}
		${'1'}          | ${'inferred'} | ${'1'}
		${'1011'}       | ${'inferred'} | ${'1011'}
		${'0b2'}        | ${'inferred'} | ${'0b2'}
		${'2'}          | ${'inferred'} | ${'2'}
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
		${'7'}          | ${'inferred'} | ${'7'}
		${'8'}          | ${'inferred'} | ${'8'}
		${'0x0'}        | ${'exact'}    | ${'0x0'}
		${'0x0F'}       | ${'exact'}    | ${'0x0F'}
		${'0xfa'}       | ${'exact'}    | ${'0xfa'}
		${'-0xfa'}      | ${'none'}     | ${''}
		${'+0xfa'}      | ${'none'}     | ${''}
		${'0xG6'}       | ${'none'}     | ${''}
		${'#0'}         | ${'exact'}    | ${'#0'}
		${'#DEADBEEF'}  | ${'exact'}    | ${'#DEADBEEF'}
		${'#692B'}      | ${'exact'}    | ${'#692B'}
		${'-#692B'}     | ${'none'}     | ${''}
		${'+#692B'}     | ${'none'}     | ${''}
		${'#ZAP'}       | ${'none'}     | ${''}
		${'$0'}         | ${'exact'}    | ${'$0'}
		${'$CCC'}       | ${'exact'}    | ${'$CCC'}
		${'$bAdFaD'}    | ${'exact'}    | ${'$bAdFaD'}
		${'-$bAdFaD'}   | ${'none'}     | ${''}
		${'+$bAdFaD'}   | ${'none'}     | ${''}
		${'$HEX'}       | ${'none'}     | ${''}
		${'B'}          | ${'inferred'} | ${'B'}
		${'0F'}         | ${'inferred'} | ${'0F'}
		${'F0'}         | ${'inferred'} | ${'F0'}
		${'-F0'}        | ${'none'}     | ${''}
		${'+F0'}        | ${'none'}     | ${''}
		${'999A999'}    | ${'inferred'} | ${'999A999'}
		${'999H999'}    | ${'none'}     | ${''}
		${'0'}          | ${'inferred'} | ${'0'}
		${'6928'}       | ${'inferred'} | ${'6928'}
		${'-6928'}      | ${'none'}     | ${''}
		${'+6928'}      | ${'none'}     | ${''}
	`(`parse($input)={$matchType,$valueString}`, ({ input, matchType, valueString }) => {
		expect(Hexadecimal.parse(input)).toEqual({ matchType, valueString })
	})

	/////

	test.each`
		input                 | isSafe
		${'0x1FFFFFFFFFFFFF'} | ${true}
		${'0x20000000000000'} | ${false}
	`(`isSafe($input)=$isSafe`, ({ input, isSafe }) => {
		expect(Hexadecimal.isSafe(input)).toBe(isSafe)
	})

	test('getMatchType returns the format type', () => {
		const spy = jest.spyOn(Hexadecimal, 'getInputType').mockImplementation(jest.fn())

		spy.mockReturnValue('hexZeroX')
		expect(Hexadecimal.getMatchType('mock-string')).toBe('exact')

		spy.mockReturnValue('hexOctothorpe')
		expect(Hexadecimal.getMatchType('mock-string')).toBe('exact')

		spy.mockReturnValue('hexDollarSign')
		expect(Hexadecimal.getMatchType('mock-string')).toBe('exact')

		spy.mockReturnValue('hexNoPrefix')
		expect(Hexadecimal.getMatchType('mock-string')).toBe('inferred')

		spy.mockReturnValue('hexInferred')
		expect(Hexadecimal.getMatchType('mock-string')).toBe('inferred')

		spy.mockReturnValue('someOtherValue')
		expect(Hexadecimal.getMatchType('mock-string')).toBe('none')

		spy.mockRestore()
	})

	test.each`
		input | expected
		${0}  | ${'0x0'}
		${1}  | ${'0x1'}
		${10} | ${'0xA'}
		${15} | ${'0xF'}
		${16} | ${'0x10'}
		${42} | ${'0x2A'}
	`(`getString($input)=$expected`, ({ input, expected }) => {
		expect(Hexadecimal.getString(Big(input))).toBe(expected)
	})

	test('getBigValueFromString returns a Big instance of Hexadecimal.getNumberFromString', () => {
		expect(Hexadecimal.getBigValueFromString('0x2A')).toEqual(Big(0x2a))
	})

	test('getNumberFromString returns the number of a given string', () => {
		expect(Hexadecimal.getNumberFromString('0x2A')).toBe(42)
		expect(Hexadecimal.getNumberFromString('#2A')).toBe(42)
		expect(Hexadecimal.getNumberFromString('$2A')).toBe(42)
		expect(Hexadecimal.getNumberFromString('2A')).toBe(42)
		expect(Hexadecimal.getNumberFromString('29')).toBe(41)
	})

	test('getNumSigFigs calls Decimal.getNumSigFigs', () => {
		const mockString = jest.fn()
		const getBigValueFromStringSpy = jest
			.spyOn(Hexadecimal, 'getBigValueFromString')
			.mockReturnValue({
				toString: () => mockString
			})
		const decimalSpy = jest.spyOn(Decimal, 'getNumSigFigs').mockImplementation(i => i)

		const result = Hexadecimal.getNumSigFigs('mock-string')

		expect(getBigValueFromStringSpy).toHaveBeenCalledWith('mock-string')
		expect(result).toBe(mockString)

		getBigValueFromStringSpy.mockRestore()
		decimalSpy.mockRestore()
	})

	test('getIsInteger returns true', () => {
		expect(Hexadecimal.getIsInteger()).toBe(true)
	})

	test('getNumDecimalDigits returns 0', () => {
		expect(Hexadecimal.getNumDecimalDigits('0xF0')).toBe(0)
		expect(Hexadecimal.getNumDecimalDigits()).toBe(0)
	})
})
