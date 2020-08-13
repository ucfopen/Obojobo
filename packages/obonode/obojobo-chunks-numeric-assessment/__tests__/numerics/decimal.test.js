/* eslint-disable new-cap */

import Decimal from '../../numerics/decimal'
import Big from 'big.js'

describe('Decimal', () => {
	test('get type returns expected type', () => {
		expect(Decimal.type).toEqual('decimal')
	})

	test('get label returns the expected label', () => {
		expect(Decimal.label).toEqual('Decimal')
	})

	test('isSafe returns true', () => {
		expect(Decimal.isSafe()).toEqual(true)
	})

	test('getBigValueFromString returns a Big object', () => {
		expect(Decimal.getBigValueFromString('-2.3')).toEqual(Big(-2.3))
		expect(Decimal.getBigValueFromString('2.')).toEqual(Big(2))
	})

	test('getStringFromBigValue returns a decimal string of a Big object', () => {
		expect(Decimal.getStringFromBigValue(Big(0))).toBe('0')
		expect(Decimal.getStringFromBigValue(Big(0.1))).toBe('0.1')
		expect(Decimal.getStringFromBigValue(Big(-0.1))).toBe('-0.1')
		expect(Decimal.getStringFromBigValue(Big(20))).toBe('20')
		expect(Decimal.getStringFromBigValue(Big(-20))).toBe('-20')
		expect(Decimal.getStringFromBigValue(Big(20.002))).toBe('20.002')
		expect(Decimal.getStringFromBigValue(Big(-20.002))).toBe('-20.002')
		const bigString =
			'9999999999999999999999999999999999999999.8888888888888888888888888888888888888888'
		expect(Decimal.getStringFromBigValue(Big(bigString))).toBe(bigString)
	})

	test.each`
		input            | expected
		${'0'}           | ${'0'}
		${'-0'}          | ${'-0'}
		${'0.0'}         | ${'0'}
		${'0.'}          | ${'0'}
		${'-0.'}         | ${'-0'}
		${'-.0'}         | ${'-0'}
		${'+.0'}         | ${'0'}
		${'2'}           | ${'2'}
		${'-2'}          | ${'-2'}
		${'-.2'}         | ${'-0.2'}
		${'+2'}          | ${'2'}
		${'2.0'}         | ${'2'}
		${'-2.0'}        | ${'-2'}
		${'+2.0'}        | ${'2'}
		${'.02'}         | ${'0.02'}
		${'.020'}        | ${'0.02'}
		${'.100'}        | ${'0.1'}
		${'100'}         | ${'100'}
		${'100.'}        | ${'100'}
		${'+100'}        | ${'100'}
		${'+100.'}       | ${'100'}
		${'-100'}        | ${'-100'}
		${'-100.'}       | ${'-100'}
		${'20'}          | ${'20'}
		${'-20'}         | ${'-20'}
		${'+20'}         | ${'20'}
		${'20.'}         | ${'20'}
		${'-20.'}        | ${'-20'}
		${'+20.'}        | ${'20'}
		${'20.0'}        | ${'20'}
		${'-20.0'}       | ${'-20'}
		${'+20.0'}       | ${'20'}
		${'20.02'}       | ${'20.02'}
		${'-20.02'}      | ${'-20.02'}
		${'+20.02'}      | ${'20.02'}
		${'020.02'}      | ${'20.02'}
		${'-020.02'}     | ${'-20.02'}
		${'+020.02'}     | ${'20.02'}
		${'08020.0280'}  | ${'8020.028'}
		${'-08020.0280'} | ${'-8020.028'}
		${'+08020.0280'} | ${'8020.028'}
	`(`getString(getBigValueFromString($input))=$expected`, ({ input, expected }) => {
		expect(Decimal.getStringFromBigValue(Decimal.getBigValueFromString(input))).toBe(expected)
	})

	test.each`
		input           | expected
		${'0'}          | ${''}
		${'-0'}         | ${''}
		${'5'}          | ${''}
		${'-5'}         | ${''}
		${'0.2'}        | ${''}
		${'-0.2'}       | ${''}
		${'0000'}       | ${''}
		${'0000.0000'}  | ${'0000'}
		${'-0000.0000'} | ${'0000'}
		${'0010.00200'} | ${'00'}
		${'0010.501'}   | ${''}
		${'0010'}       | ${''}
		${'100.'}       | ${'.'}
	`(`getTrailingSigFigContentFromString($input)=$expected`, ({ input, expected }) => {
		expect(Decimal.getTrailingSigFigContentFromString(input)).toBe(expected)
	})

	test.each`
		input            | expected
		${'0'}           | ${0}
		${'-0'}          | ${0}
		${'0.0'}         | ${0}
		${'0.'}          | ${0}
		${'-0.'}         | ${0}
		${'-.0'}         | ${0}
		${'+.0'}         | ${0}
		${'2'}           | ${1}
		${'-2'}          | ${1}
		${'-.2'}         | ${1}
		${'+2'}          | ${1}
		${'2.0'}         | ${2}
		${'-2.0'}        | ${2}
		${'+2.0'}        | ${2}
		${'.02'}         | ${1}
		${'.020'}        | ${2}
		${'.100'}        | ${3}
		${'100'}         | ${1}
		${'100.'}        | ${3}
		${'+100'}        | ${1}
		${'+100.'}       | ${3}
		${'-100'}        | ${1}
		${'-100.'}       | ${3}
		${'20'}          | ${1}
		${'-20'}         | ${1}
		${'+20'}         | ${1}
		${'20.'}         | ${2}
		${'-20.'}        | ${2}
		${'+20.'}        | ${2}
		${'20.0'}        | ${3}
		${'-20.0'}       | ${3}
		${'+20.0'}       | ${3}
		${'20.02'}       | ${4}
		${'-20.02'}      | ${4}
		${'+20.02'}      | ${4}
		${'020.02'}      | ${4}
		${'-020.02'}     | ${4}
		${'+020.02'}     | ${4}
		${'08020.0280'}  | ${8}
		${'-08020.0280'} | ${8}
		${'+08020.0280'} | ${8}
		${'09901.010'}   | ${7}
	`(`getNumSigFigs($input)=$expected`, ({ input, expected }) => {
		expect(Decimal.getNumSigFigs(input)).toBe(expected)
	})

	test.each`
		input            | expected
		${'0'}           | ${true}
		${'-0'}          | ${true}
		${'0.0'}         | ${true}
		${'0.'}          | ${true}
		${'-0.'}         | ${true}
		${'-.0'}         | ${true}
		${'+.0'}         | ${true}
		${'2'}           | ${true}
		${'-2'}          | ${true}
		${'-.2'}         | ${false}
		${'+2'}          | ${true}
		${'2.0'}         | ${true}
		${'-2.0'}        | ${true}
		${'+2.0'}        | ${true}
		${'.02'}         | ${false}
		${'.020'}        | ${false}
		${'.100'}        | ${false}
		${'100'}         | ${true}
		${'100.'}        | ${true}
		${'+100'}        | ${true}
		${'+100.'}       | ${true}
		${'-100'}        | ${true}
		${'-100.'}       | ${true}
		${'20'}          | ${true}
		${'-20'}         | ${true}
		${'+20'}         | ${true}
		${'20.'}         | ${true}
		${'-20.'}        | ${true}
		${'+20.'}        | ${true}
		${'20.0'}        | ${true}
		${'-20.0'}       | ${true}
		${'+20.0'}       | ${true}
		${'20.02'}       | ${false}
		${'-20.02'}      | ${false}
		${'+20.02'}      | ${false}
		${'020.02'}      | ${false}
		${'-020.02'}     | ${false}
		${'+020.02'}     | ${false}
		${'08020.0280'}  | ${false}
		${'-08020.0280'} | ${false}
		${'+08020.0280'} | ${false}
	`(`getIsInteger($input)=$expected`, ({ input, expected }) => {
		expect(Decimal.getIsInteger(input)).toBe(expected)
	})

	test.each`
		input            | expected
		${'0'}           | ${0}
		${'-0'}          | ${0}
		${'0.0'}         | ${0}
		${'0.'}          | ${0}
		${'-0.'}         | ${0}
		${'-.0'}         | ${0}
		${'+.0'}         | ${0}
		${'2'}           | ${0}
		${'-2'}          | ${0}
		${'-.2'}         | ${1}
		${'+2'}          | ${0}
		${'2.0'}         | ${0}
		${'-2.0'}        | ${0}
		${'+2.0'}        | ${0}
		${'.02'}         | ${2}
		${'.020'}        | ${2}
		${'.100'}        | ${1}
		${'100'}         | ${0}
		${'100.'}        | ${0}
		${'+100'}        | ${0}
		${'+100.'}       | ${0}
		${'-100'}        | ${0}
		${'-100.'}       | ${0}
		${'20'}          | ${0}
		${'-20'}         | ${0}
		${'+20'}         | ${0}
		${'20.'}         | ${0}
		${'-20.'}        | ${0}
		${'+20.'}        | ${0}
		${'20.0'}        | ${0}
		${'-20.0'}       | ${0}
		${'+20.0'}       | ${0}
		${'20.02'}       | ${2}
		${'-20.02'}      | ${2}
		${'+20.02'}      | ${2}
		${'020.02'}      | ${2}
		${'-020.02'}     | ${2}
		${'+020.02'}     | ${2}
		${'08020.0280'}  | ${3}
		${'-08020.0280'} | ${3}
		${'+08020.0280'} | ${3}
	`(`getNumDecimalDigits($input)=$expected`, ({ input, expected }) => {
		expect(Decimal.getNumDecimalDigits(input)).toBe(expected)
	})

	test.each`
		input           | matchType  | valueString
		${'0'}          | ${'exact'} | ${'0'}
		${'000000'}     | ${'exact'} | ${'0'}
		${'0.'}         | ${'exact'} | ${'0.'}
		${'+.0'}        | ${'exact'} | ${'0.0'}
		${'-.2'}        | ${'exact'} | ${'-0.2'}
		${'1/2'}        | ${'none'}  | ${''}
		${'0/2'}        | ${'none'}  | ${''}
		${'6.6/6'}      | ${'none'}  | ${''}
		${'+33/22'}     | ${'none'}  | ${''}
		${'-0/0'}       | ${'none'}  | ${''}
		${'6.02e23'}    | ${'none'}  | ${''}
		${'60.2e23'}    | ${'none'}  | ${''}
		${'6.02e2.3'}   | ${'none'}  | ${''}
		${'60.2x10^23'} | ${'none'}  | ${''}
		${'6*10^23'}    | ${'none'}  | ${''}
		${"-6.02'23"}   | ${'none'}  | ${''}
		${'-6.02ee-23'} | ${'none'}  | ${''}
		${'0b0'}        | ${'none'}  | ${''}
		${'0b1'}        | ${'none'}  | ${''}
		${'0b1011'}     | ${'none'}  | ${''}
		${'0'}          | ${'exact'} | ${'0'}
		${'1'}          | ${'exact'} | ${'1'}
		${'1011'}       | ${'exact'} | ${'1011'}
		${'0b2'}        | ${'none'}  | ${''}
		${'2'}          | ${'exact'} | ${'2'}
		${'-0b0'}       | ${'none'}  | ${''}
		${'-0'}         | ${'exact'} | ${'-0'}
		${'-0b0'}       | ${'none'}  | ${''}
		${'-0'}         | ${'exact'} | ${'-0'}
		${'0o0'}        | ${'none'}  | ${''}
		${'0o1'}        | ${'none'}  | ${''}
		${'0o7'}        | ${'none'}  | ${''}
		${'0o8'}        | ${'none'}  | ${''}
		${'0o777'}      | ${'none'}  | ${''}
		${'0o781'}      | ${'none'}  | ${''}
		${'7'}          | ${'exact'} | ${'7'}
		${'8'}          | ${'exact'} | ${'8'}
		${'0x0'}        | ${'none'}  | ${''}
		${'0x0F'}       | ${'none'}  | ${''}
		${'0xfa'}       | ${'none'}  | ${''}
		${'-0xfa'}      | ${'none'}  | ${''}
		${'+0xfa'}      | ${'none'}  | ${''}
		${'0xG6'}       | ${'none'}  | ${''}
		${'#0'}         | ${'none'}  | ${''}
		${'#DEADBEEF'}  | ${'none'}  | ${''}
		${'#692B'}      | ${'none'}  | ${''}
		${'-#692B'}     | ${'none'}  | ${''}
		${'+#692B'}     | ${'none'}  | ${''}
		${'#ZAP'}       | ${'none'}  | ${''}
		${'$0'}         | ${'none'}  | ${''}
		${'$CCC'}       | ${'none'}  | ${''}
		${'$bAdFaD'}    | ${'none'}  | ${''}
		${'-$bAdFaD'}   | ${'none'}  | ${''}
		${'+$bAdFaD'}   | ${'none'}  | ${''}
		${'$HEX'}       | ${'none'}  | ${''}
		${'B'}          | ${'none'}  | ${''}
		${'0F'}         | ${'none'}  | ${''}
		${'F0'}         | ${'none'}  | ${''}
		${'-F0'}        | ${'none'}  | ${''}
		${'+F0'}        | ${'none'}  | ${''}
		${'999A999'}    | ${'none'}  | ${''}
		${'999H999'}    | ${'none'}  | ${''}
		${'0'}          | ${'exact'} | ${'0'}
		${'6928'}       | ${'exact'} | ${'6928'}
		${'-6928'}      | ${'exact'} | ${'-6928'}
		${'+6928'}      | ${'exact'} | ${'6928'}
	`(`parse($input)={$matchType,$valueString}`, ({ input, matchType, valueString }) => {
		expect(Decimal.parse(input)).toEqual({ matchType, valueString })
	})
})
