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
	`(`getString(getBigValue($input))=$expected`, ({ input, expected }) => {
		expect(Decimal.getString(Decimal.getBigValue(input))).toBe(expected)
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
		${'0'}           | ${1}
		${'-0'}          | ${1}
		${'0.0'}         | ${1}
		${'0.'}          | ${1}
		${'-0.'}         | ${1}
		${'-.0'}         | ${1}
		${'+.0'}         | ${1}
		${'2'}           | ${1}
		${'-2'}          | ${1}
		${'-.2'}         | ${2}
		${'+2'}          | ${1}
		${'2.0'}         | ${1}
		${'-2.0'}        | ${1}
		${'+2.0'}        | ${1}
		${'.02'}         | ${3}
		${'.020'}        | ${3}
		${'.100'}        | ${2}
		${'100'}         | ${3}
		${'100.'}        | ${3}
		${'+100'}        | ${3}
		${'+100.'}       | ${3}
		${'-100'}        | ${3}
		${'-100.'}       | ${3}
		${'20'}          | ${2}
		${'-20'}         | ${2}
		${'+20'}         | ${2}
		${'20.'}         | ${2}
		${'-20.'}        | ${2}
		${'+20.'}        | ${2}
		${'20.0'}        | ${2}
		${'-20.0'}       | ${2}
		${'+20.0'}       | ${2}
		${'20.02'}       | ${4}
		${'-20.02'}      | ${4}
		${'+20.02'}      | ${4}
		${'020.02'}      | ${4}
		${'-020.02'}     | ${4}
		${'+020.02'}     | ${4}
		${'08020.0280'}  | ${7}
		${'-08020.0280'} | ${7}
		${'+08020.0280'} | ${7}
	`(`getNumDigits($input)=$expected`, ({ input, expected }) => {
		expect(Decimal.getNumDigits(input)).toBe(expected)
	})

	test.each`
		input          | matchType  | valueString | unit
		${'0'}         | ${'exact'} | ${'0'}      | ${''}
		${'-0g'}       | ${'exact'} | ${'-0'}     | ${'g'}
		${'0.0 g'}     | ${'exact'} | ${'0.0'}    | ${'g'}
		${'0.'}        | ${'exact'} | ${'0.'}     | ${''}
		${'-0.Miles'}  | ${'exact'} | ${'-0.'}    | ${'Miles'}
		${'-.0 Miles'} | ${'exact'} | ${'-.0'}    | ${'Miles'}
		${'+.0'}       | ${'exact'} | ${'+.0'}    | ${''}
		${'2kCal'}     | ${'exact'} | ${'2'}      | ${'kCal'}
		${'-2 kCal'}   | ${'exact'} | ${'-2'}     | ${'kCal'}
		${'1.21 Ω'}    | ${'exact'} | ${'1.21'}   | ${'Ω'}
		${'99.9%'}     | ${'exact'} | ${'99.9'}   | ${'%'}
		${'-.2'}       | ${'exact'} | ${'-.2'}    | ${''}
		${'1/2'}       | ${'none'}  | ${''}       | ${''}
	`(`parse($input)={$matchType,$valueString,$unit}`, ({ input, matchType, valueString, unit }) => {
		expect(Decimal.parse(input)).toEqual({ matchType, valueString, unit })
	})
})
