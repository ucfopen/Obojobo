import Scientific from '../../numerics/scientific'
import Big from 'big.js'

describe('Scientific', () => {
	test('get type returns expected type', () => {
		expect(Scientific.type).toEqual('scientific')
	})

	test('get label returns the expected label', () => {
		expect(Scientific.label).toEqual('Scientific Notation')
	})

	test('isSafe returns true', () => {
		expect(Scientific.isSafe()).toEqual(true)
	})

	test.each`
		input            | expected
		${'6.02e23'}     | ${'e'}
		${'6.02x10^23'}  | ${'x'}
		${'6.02*10^23'}  | ${'asterisk'}
		${"6.02'23"}     | ${'apos'}
		${'6.02ee23'}    | ${'ee'}
		${'6.02'}        | ${null}
		${'6.02e10^23'}  | ${'e'}
		${'6.02ee10^23'} | ${'ee'}
		${'6.02x23'}     | ${null}
		${'6.02*23'}     | ${null}
		${"6.02''23"}    | ${null}
		${'6.02^23'}     | ${null}
	`(`getInputType($input)=$expected`, ({ input, expected }) => {
		expect(Scientific.getInputType(input)).toBe(expected)
	})

	test.each`
		input                 | expected
		${'6.02e23 mols'}     | ${'6.02e23'}
		${'6.02x10^23 mols'}  | ${'6.02x10^23'}
		${'6.02*10^23 mols'}  | ${'6.02*10^23'}
		${"6.02'23 mols"}     | ${"6.02'23"}
		${'6.02ee23 mols'}    | ${'6.02ee23'}
		${'6.02 mols'}        | ${null}
		${'6.02e10^23 mols'}  | ${'6.02e10'}
		${'6.02ee10^23 mols'} | ${'6.02ee10'}
		${'6.02x23 mols'}     | ${null}
		${'6.02*23 mols'}     | ${null}
		${"6.02''23 mols"}    | ${null}
		${'6.02^23 mols'}     | ${null}
		${'6.02e23mols'}      | ${'6.02e23'}
		${'6.02x10^23mols'}   | ${'6.02x10^23'}
		${'6.02*10^23mols'}   | ${'6.02*10^23'}
		${"6.02'23mols"}      | ${"6.02'23"}
		${'6.02ee23mols'}     | ${'6.02ee23'}
		${'6.02mols'}         | ${null}
		${'6.02e10^23mols'}   | ${'6.02e10'}
		${'6.02ee10^23mols'}  | ${'6.02ee10'}
		${'6.02x23mols'}      | ${null}
		${'6.02*23mols'}      | ${null}
		${"6.02''23mols"}     | ${null}
		${'6.02^23mols'}      | ${null}
	`(`getValueString($input)=$expected`, ({ input, expected }) => {
		expect(Scientific.getValueString(input)).toBe(expected)
	})

	test.each`
		input                 | matchType  | valueString     | unit
		${'0'}                | ${'none'}  | ${''}           | ${''}
		${'000000'}           | ${'none'}  | ${''}           | ${''}
		${'-0g'}              | ${'none'}  | ${''}           | ${''}
		${'0.0 g'}            | ${'none'}  | ${''}           | ${''}
		${'0.'}               | ${'none'}  | ${''}           | ${''}
		${'-0.Miles'}         | ${'none'}  | ${''}           | ${''}
		${'-.0 Miles'}        | ${'none'}  | ${''}           | ${''}
		${'+.0'}              | ${'none'}  | ${''}           | ${''}
		${'2kCal'}            | ${'none'}  | ${''}           | ${''}
		${'-2 kCal'}          | ${'none'}  | ${''}           | ${''}
		${'1.21 Ω'}           | ${'none'}  | ${''}           | ${''}
		${'99.9%'}            | ${'none'}  | ${''}           | ${''}
		${'-.2'}              | ${'none'}  | ${''}           | ${''}
		${'1/2'}              | ${'none'}  | ${''}           | ${''}
		${'0/2'}              | ${'none'}  | ${''}           | ${''}
		${'-0/2g'}            | ${'none'}  | ${''}           | ${''}
		${'6/6 g'}            | ${'none'}  | ${''}           | ${''}
		${'6.6/6'}            | ${'none'}  | ${''}           | ${''}
		${'9/2Miles'}         | ${'none'}  | ${''}           | ${''}
		${'-9/2 Miles'}       | ${'none'}  | ${''}           | ${''}
		${'+33/22'}           | ${'none'}  | ${''}           | ${''}
		${'2/2kCal'}          | ${'none'}  | ${''}           | ${''}
		${'-2/2 kCal'}        | ${'none'}  | ${''}           | ${''}
		${'1/21 Ω'}           | ${'none'}  | ${''}           | ${''}
		${'99/9%'}            | ${'none'}  | ${''}           | ${''}
		${'-0/0'}             | ${'none'}  | ${''}           | ${''}
		${'6.02e23'}          | ${'exact'} | ${'6.02e23'}    | ${''}
		${'60.2e23'}          | ${'exact'} | ${'60.2e23'}    | ${''}
		${'6.02e2.3'}         | ${'none'}  | ${''}           | ${''}
		${'60.2x10^23'}       | ${'exact'} | ${'60.2x10^23'} | ${''}
		${'6*10^23'}          | ${'exact'} | ${'6*10^23'}    | ${''}
		${"-6.02'23"}         | ${'exact'} | ${"-6.02'23"}   | ${''}
		${'-6.02ee-23'}       | ${'exact'} | ${'-6.02ee-23'} | ${''}
		${'+6.02e+23 mols'}   | ${'exact'} | ${'+6.02e+23'}  | ${'mols'}
		${'6.02x10^23 mols'}  | ${'exact'} | ${'6.02x10^23'} | ${'mols'}
		${'6.02*10^23 mols'}  | ${'exact'} | ${'6.02*10^23'} | ${'mols'}
		${"6.02'23 mols"}     | ${'exact'} | ${"6.02'23"}    | ${'mols'}
		${'6.02ee23 mols'}    | ${'exact'} | ${'6.02ee23'}   | ${'mols'}
		${'6.02e10^23 mols'}  | ${'none'}  | ${''}           | ${''}
		${'6.02ee10^23 mols'} | ${'none'}  | ${''}           | ${''}
		${'6.02x23 mols'}     | ${'none'}  | ${''}           | ${''}
		${'6.02*23 mols'}     | ${'none'}  | ${''}           | ${''}
		${"6.02''23 mols"}    | ${'none'}  | ${''}           | ${''}
		${'6.02^23 mols'}     | ${'none'}  | ${''}           | ${''}
		${'6.02e23mols'}      | ${'exact'} | ${'6.02e23'}    | ${'mols'}
		${'6.02x10^23mols'}   | ${'exact'} | ${'6.02x10^23'} | ${'mols'}
		${'6.02*10^23mols'}   | ${'exact'} | ${'6.02*10^23'} | ${'mols'}
		${"6.02'23mols"}      | ${'exact'} | ${"6.02'23"}    | ${'mols'}
		${'6.02ee23mols'}     | ${'exact'} | ${'6.02ee23'}   | ${'mols'}
		${'6.02mols'}         | ${'none'}  | ${''}           | ${''}
		${'6.02e10^23mols'}   | ${'none'}  | ${''}           | ${''}
		${'6.02ee10^23mols'}  | ${'none'}  | ${''}           | ${''}
		${'6.02x23mols'}      | ${'none'}  | ${''}           | ${''}
		${'6.02*23mols'}      | ${'none'}  | ${''}           | ${''}
		${"6.02''23mols"}     | ${'none'}  | ${''}           | ${''}
		${'6.02^23mols'}      | ${'none'}  | ${''}           | ${''}
		${'0b0'}              | ${'none'}  | ${''}           | ${''}
		${'0b1'}              | ${'none'}  | ${''}           | ${''}
		${'0b1011'}           | ${'none'}  | ${''}           | ${''}
		${'0'}                | ${'none'}  | ${''}           | ${''}
		${'1'}                | ${'none'}  | ${''}           | ${''}
		${'1011'}             | ${'none'}  | ${''}           | ${''}
		${'0b2'}              | ${'none'}  | ${''}           | ${''}
		${'2'}                | ${'none'}  | ${''}           | ${''}
		${'0b0 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0b1 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0b1011 bytes'}     | ${'none'}  | ${''}           | ${''}
		${'0 bytes'}          | ${'none'}  | ${''}           | ${''}
		${'1 bytes'}          | ${'none'}  | ${''}           | ${''}
		${'1011 bytes'}       | ${'none'}  | ${''}           | ${''}
		${'0b2 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'2 bytes'}          | ${'none'}  | ${''}           | ${''}
		${'-0b0'}             | ${'none'}  | ${''}           | ${''}
		${'-0b1 bytes'}       | ${'none'}  | ${''}           | ${''}
		${'-0'}               | ${'none'}  | ${''}           | ${''}
		${'-01 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0b0bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0b1bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0b1011bytes'}      | ${'none'}  | ${''}           | ${''}
		${'0bytes'}           | ${'none'}  | ${''}           | ${''}
		${'1bytes'}           | ${'none'}  | ${''}           | ${''}
		${'1011bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0b2bytes'}         | ${'none'}  | ${''}           | ${''}
		${'2bytes'}           | ${'none'}  | ${''}           | ${''}
		${'-0b0'}             | ${'none'}  | ${''}           | ${''}
		${'-0b1bytes'}        | ${'none'}  | ${''}           | ${''}
		${'-0'}               | ${'none'}  | ${''}           | ${''}
		${'-01bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0o0'}              | ${'none'}  | ${''}           | ${''}
		${'0o1'}              | ${'none'}  | ${''}           | ${''}
		${'0o7'}              | ${'none'}  | ${''}           | ${''}
		${'0o8'}              | ${'none'}  | ${''}           | ${''}
		${'0o777'}            | ${'none'}  | ${''}           | ${''}
		${'0o781'}            | ${'none'}  | ${''}           | ${''}
		${'7'}                | ${'none'}  | ${''}           | ${''}
		${'8'}                | ${'none'}  | ${''}           | ${''}
		${'0o0 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0o1 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0o7 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0o8 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0o777 bytes'}      | ${'none'}  | ${''}           | ${''}
		${'0o781 bytes'}      | ${'none'}  | ${''}           | ${''}
		${'7 bytes'}          | ${'none'}  | ${''}           | ${''}
		${'8 bytes'}          | ${'none'}  | ${''}           | ${''}
		${'0o0bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0o1bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0o7bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0o8bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0o777bytes'}       | ${'none'}  | ${''}           | ${''}
		${'0o781bytes'}       | ${'none'}  | ${''}           | ${''}
		${'7bytes'}           | ${'none'}  | ${''}           | ${''}
		${'8bytes'}           | ${'none'}  | ${''}           | ${''}
		${'0x0'}              | ${'none'}  | ${''}           | ${''}
		${'0x0F'}             | ${'none'}  | ${''}           | ${''}
		${'0xfa'}             | ${'none'}  | ${''}           | ${''}
		${'-0xfa'}            | ${'none'}  | ${''}           | ${''}
		${'+0xfa'}            | ${'none'}  | ${''}           | ${''}
		${'0xG6'}             | ${'none'}  | ${''}           | ${''}
		${'#0'}               | ${'none'}  | ${''}           | ${''}
		${'#DEADBEEF'}        | ${'none'}  | ${''}           | ${''}
		${'#692B'}            | ${'none'}  | ${''}           | ${''}
		${'-#692B'}           | ${'none'}  | ${''}           | ${''}
		${'+#692B'}           | ${'none'}  | ${''}           | ${''}
		${'#ZAP'}             | ${'none'}  | ${''}           | ${''}
		${'$0'}               | ${'none'}  | ${''}           | ${''}
		${'$CCC'}             | ${'none'}  | ${''}           | ${''}
		${'$bAdFaD'}          | ${'none'}  | ${''}           | ${''}
		${'-$bAdFaD'}         | ${'none'}  | ${''}           | ${''}
		${'+$bAdFaD'}         | ${'none'}  | ${''}           | ${''}
		${'$HEX'}             | ${'none'}  | ${''}           | ${''}
		${'B'}                | ${'none'}  | ${''}           | ${''}
		${'0F'}               | ${'none'}  | ${''}           | ${''}
		${'F0'}               | ${'none'}  | ${''}           | ${''}
		${'-F0'}              | ${'none'}  | ${''}           | ${''}
		${'+F0'}              | ${'none'}  | ${''}           | ${''}
		${'999A999'}          | ${'none'}  | ${''}           | ${''}
		${'999H999'}          | ${'none'}  | ${''}           | ${''}
		${'0'}                | ${'none'}  | ${''}           | ${''}
		${'6928'}             | ${'none'}  | ${''}           | ${''}
		${'-6928'}            | ${'none'}  | ${''}           | ${''}
		${'+6928'}            | ${'none'}  | ${''}           | ${''}
		${'0x0 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'0x0F bytes'}       | ${'none'}  | ${''}           | ${''}
		${'0xfa bytes'}       | ${'none'}  | ${''}           | ${''}
		${'-0xfa bytes'}      | ${'none'}  | ${''}           | ${''}
		${'+0xfa bytes'}      | ${'none'}  | ${''}           | ${''}
		${'0xG6 bytes'}       | ${'none'}  | ${''}           | ${''}
		${'#0 bytes'}         | ${'none'}  | ${''}           | ${''}
		${'#DEADBEEF bytes'}  | ${'none'}  | ${''}           | ${''}
		${'#692B bytes'}      | ${'none'}  | ${''}           | ${''}
		${'-#692B bytes'}     | ${'none'}  | ${''}           | ${''}
		${'+#692B bytes'}     | ${'none'}  | ${''}           | ${''}
		${'#ZAP bytes'}       | ${'none'}  | ${''}           | ${''}
		${'$0 bytes'}         | ${'none'}  | ${''}           | ${''}
		${'$CCC bytes'}       | ${'none'}  | ${''}           | ${''}
		${'$bAdFaD bytes'}    | ${'none'}  | ${''}           | ${''}
		${'-$bAdFaD bytes'}   | ${'none'}  | ${''}           | ${''}
		${'+$bAdFaD bytes'}   | ${'none'}  | ${''}           | ${''}
		${'$HEX bytes'}       | ${'none'}  | ${''}           | ${''}
		${'B bytes'}          | ${'none'}  | ${''}           | ${''}
		${'0F bytes'}         | ${'none'}  | ${''}           | ${''}
		${'F0 bytes'}         | ${'none'}  | ${''}           | ${''}
		${'-F0 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'+F0 bytes'}        | ${'none'}  | ${''}           | ${''}
		${'999A999 bytes'}    | ${'none'}  | ${''}           | ${''}
		${'999H999 bytes'}    | ${'none'}  | ${''}           | ${''}
		${'0 bytes'}          | ${'none'}  | ${''}           | ${''}
		${'6928 bytes'}       | ${'none'}  | ${''}           | ${''}
		${'-6928 bytes'}      | ${'none'}  | ${''}           | ${''}
		${'+6928 bytes'}      | ${'none'}  | ${''}           | ${''}
		${'0x0bytes'}         | ${'none'}  | ${''}           | ${''}
		${'0x0Fbytes'}        | ${'none'}  | ${''}           | ${''}
		${'0xfabytes'}        | ${'none'}  | ${''}           | ${''}
		${'-0xfabytes'}       | ${'none'}  | ${''}           | ${''}
		${'+0xfabytes'}       | ${'none'}  | ${''}           | ${''}
		${'0xG6bytes'}        | ${'none'}  | ${''}           | ${''}
		${'#0bytes'}          | ${'none'}  | ${''}           | ${''}
		${'#DEADBEEFbytes'}   | ${'none'}  | ${''}           | ${''}
		${'#692Bbytes'}       | ${'none'}  | ${''}           | ${''}
		${'-#692Bbytes'}      | ${'none'}  | ${''}           | ${''}
		${'+#692Bbytes'}      | ${'none'}  | ${''}           | ${''}
		${'#ZAPbytes'}        | ${'none'}  | ${''}           | ${''}
		${'$0bytes'}          | ${'none'}  | ${''}           | ${''}
		${'$CCCbytes'}        | ${'none'}  | ${''}           | ${''}
		${'$bAdFaDbytes'}     | ${'none'}  | ${''}           | ${''}
		${'-$bAdFaDbytes'}    | ${'none'}  | ${''}           | ${''}
		${'+$bAdFaDbytes'}    | ${'none'}  | ${''}           | ${''}
		${'$HEXbytes'}        | ${'none'}  | ${''}           | ${''}
		${'Bbytes'}           | ${'none'}  | ${''}           | ${''}
		${'0Fbytes'}          | ${'none'}  | ${''}           | ${''}
		${'F0bytes'}          | ${'none'}  | ${''}           | ${''}
		${'-F0bytes'}         | ${'none'}  | ${''}           | ${''}
		${'+F0bytes'}         | ${'none'}  | ${''}           | ${''}
		${'999A999bytes'}     | ${'none'}  | ${''}           | ${''}
		${'999H999bytes'}     | ${'none'}  | ${''}           | ${''}
		${'0bytes'}           | ${'none'}  | ${''}           | ${''}
		${'6928bytes'}        | ${'none'}  | ${''}           | ${''}
		${'-6928bytes'}       | ${'none'}  | ${''}           | ${''}
		${'+6928bytes'}       | ${'none'}  | ${''}           | ${''}
	`(`parse($input)={$matchType,$valueString,$unit}`, ({ input, matchType, valueString, unit }) => {
		expect(Scientific.parse(input)).toEqual({ matchType, valueString, unit })
	})

	test('getBigValue returns the bigValue attribute of getTerms()', () => {
		const mockBigValue = jest.fn()
		const spy = jest.spyOn(Scientific, 'getTerms').mockReturnValue({
			bigValue: mockBigValue
		})

		const result = Scientific.getBigValue('mock-string')
		expect(result).toBe(mockBigValue)
		expect(spy).toHaveBeenCalledWith('mock-string')

		spy.mockRestore()
	})

	test('getNumSigFigs returns the length of the bigDigit term', () => {
		const mockLength = jest.fn()
		const spy = jest.spyOn(Scientific, 'getTerms').mockReturnValue({
			bigDigit: {
				c: {
					length: mockLength
				}
			}
		})

		const result = Scientific.getNumSigFigs('mock-string')
		expect(result).toBe(mockLength)
		expect(spy).toHaveBeenCalledWith('mock-string')

		spy.mockRestore()
	})

	test.each`
		input        | isInteger
		${'6.02e23'} | ${true}
		${'60.2e23'} | ${true}
		${'6e2'}     | ${true}
		${'6e1'}     | ${true}
		${'6e0'}     | ${true}
		${'6e-1'}    | ${false}
		${'60e-1'}   | ${true}
		${'6.8e-1'}  | ${false}
		${'60.8e-1'} | ${false}
		${'60.8e1'}  | ${true}
	`(`getIsInteger($input)=$isInteger`, ({ input, isInteger }) => {
		expect(Scientific.getIsInteger(input)).toBe(isInteger)
	})

	test.each`
		input        | numDigits
		${'6.02e23'} | ${0}
		${'60.2e23'} | ${0}
		${'6e2'}     | ${0}
		${'6e1'}     | ${0}
		${'6e0'}     | ${0}
		${'6e-1'}    | ${1}
		${'60e-1'}   | ${0}
		${'6.8e-1'}  | ${2}
		${'60.8e-1'} | ${2}
		${'60.8e1'}  | ${0}
	`(`getNumDecimalDigits($input)=$numDigits`, ({ input, numDigits }) => {
		expect(Scientific.getNumDecimalDigits(input)).toBe(numDigits)
	})

	test.each`
		input            | string
		${100}           | ${'1e2'}
		${10}            | ${'1e1'}
		${1}             | ${'1e0'}
		${0}             | ${'0e0'}
		${-1}            | ${'-1e0'}
		${-10}           | ${'-1e1'}
		${98765}         | ${'9.8765e4'}
		${9175849578342} | ${'9.175849578342e12'}
		${0.1}           | ${'1e-1'}
		${0.01}          | ${'1e-2'}
		${0.001}         | ${'1e-3'}
		${0.000573849}   | ${'5.73849e-4'}
	`(`getString($input)=$string`, ({ input, string }) => {
		expect(Scientific.getString(Big(input))).toBe(string)
	})

	test.each`
		input          | digit   | exponent | value
		${'6.02e23'}   | ${6.02} | ${23}    | ${6.02e23}
		${'-2.5ee-4'}  | ${-2.5} | ${-4}    | ${-2.5e-4}
		${'0x10^1'}    | ${0}    | ${1}     | ${0e1}
		${'99.1*10^3'} | ${99.1} | ${3}     | ${99.1e3}
		${"99.1'-3"}   | ${99.1} | ${-3}    | ${99.1e-3}
	`(`getTerms($input)=$digit,$exponent`, ({ input, digit, exponent, value }) => {
		expect(Scientific.getTerms(input)).toEqual({
			bigDigit: Big(digit),
			bigExponential: Big(exponent),
			bigValue: Big(value)
		})
	})

	test.each`
		input        | expected
		${'6.02e23'} | ${true}
		${'60.2e23'} | ${false}
		${'-6.2e23'} | ${true}
		${'0.21e-1'} | ${false}
		${'999.9e9'} | ${false}
	`(`getIsValidScientific($input)=$expected`, ({ input, expected }) => {
		expect(Scientific.getIsValidScientific(input)).toBe(expected)
	})
})
