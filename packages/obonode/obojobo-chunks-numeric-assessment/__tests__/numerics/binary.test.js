import Binary from '../../numerics/binary'
import Decimal from '../../numerics/decimal'
import Big from 'big.js'

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
		input             | expected
		${'0b0'}          | ${'0b0'}
		${'0b1'}          | ${'0b1'}
		${'0b1011'}       | ${'0b1011'}
		${'0'}            | ${'0'}
		${'1'}            | ${'1'}
		${'1011'}         | ${'1011'}
		${'0b2'}          | ${null}
		${'2'}            | ${null}
		${'0b0 bytes'}    | ${'0b0'}
		${'0b1 bytes'}    | ${'0b1'}
		${'0b1011 bytes'} | ${'0b1011'}
		${'0 bytes'}      | ${'0'}
		${'1 bytes'}      | ${'1'}
		${'1011 bytes'}   | ${'1011'}
		${'0b2 bytes'}    | ${null}
		${'2 bytes'}      | ${null}
		${'0b0bytes'}     | ${null}
		${'0b1bytes'}     | ${null}
		${'0b1011bytes'}  | ${null}
		${'0bytes'}       | ${null}
		${'1bytes'}       | ${null}
		${'1011bytes'}    | ${null}
		${'0b2bytes'}     | ${null}
		${'2bytes'}       | ${null}
	`(`getValueString($input)=$expected`, ({ input, expected }) => {
		expect(Binary.getValueString(input)).toBe(expected)
	})
	////

	test.each`
		input                 | matchType     | valueString | unit
		${'0'}                | ${'inferred'} | ${'0'}      | ${''}
		${'000000'}           | ${'inferred'} | ${'000000'} | ${''}
		${'-0g'}              | ${'none'}     | ${''}       | ${''}
		${'0.0 g'}            | ${'none'}     | ${''}       | ${''}
		${'0.'}               | ${'none'}     | ${''}       | ${''}
		${'-0.Miles'}         | ${'none'}     | ${''}       | ${''}
		${'-.0 Miles'}        | ${'none'}     | ${''}       | ${''}
		${'+.0'}              | ${'none'}     | ${''}       | ${''}
		${'2kCal'}            | ${'none'}     | ${''}       | ${''}
		${'-2 kCal'}          | ${'none'}     | ${''}       | ${''}
		${'1.21 Ω'}           | ${'none'}     | ${''}       | ${''}
		${'99.9%'}            | ${'none'}     | ${''}       | ${''}
		${'-.2'}              | ${'none'}     | ${''}       | ${''}
		${'1/2'}              | ${'none'}     | ${''}       | ${''}
		${'0/2'}              | ${'none'}     | ${''}       | ${''}
		${'-0/2g'}            | ${'none'}     | ${''}       | ${''}
		${'6/6 g'}            | ${'none'}     | ${''}       | ${''}
		${'6.6/6'}            | ${'none'}     | ${''}       | ${''}
		${'9/2Miles'}         | ${'none'}     | ${''}       | ${''}
		${'-9/2 Miles'}       | ${'none'}     | ${''}       | ${''}
		${'+33/22'}           | ${'none'}     | ${''}       | ${''}
		${'2/2kCal'}          | ${'none'}     | ${''}       | ${''}
		${'-2/2 kCal'}        | ${'none'}     | ${''}       | ${''}
		${'1/21 Ω'}           | ${'none'}     | ${''}       | ${''}
		${'99/9%'}            | ${'none'}     | ${''}       | ${''}
		${'-0/0'}             | ${'none'}     | ${''}       | ${''}
		${'6.02e23'}          | ${'none'}     | ${''}       | ${''}
		${'60.2e23'}          | ${'none'}     | ${''}       | ${''}
		${'6.02e2.3'}         | ${'none'}     | ${''}       | ${''}
		${'60.2x10^23'}       | ${'none'}     | ${''}       | ${''}
		${'6*10^23'}          | ${'none'}     | ${''}       | ${''}
		${"-6.02'23"}         | ${'none'}     | ${''}       | ${''}
		${'-6.02ee-23'}       | ${'none'}     | ${''}       | ${''}
		${'+6.02e+23 mols'}   | ${'none'}     | ${''}       | ${''}
		${'6.02x10^23 mols'}  | ${'none'}     | ${''}       | ${''}
		${'6.02*10^23 mols'}  | ${'none'}     | ${''}       | ${''}
		${"6.02'23 mols"}     | ${'none'}     | ${''}       | ${''}
		${'6.02ee23 mols'}    | ${'none'}     | ${''}       | ${''}
		${'6.02e10^23 mols'}  | ${'none'}     | ${''}       | ${''}
		${'6.02ee10^23 mols'} | ${'none'}     | ${''}       | ${''}
		${'6.02x23 mols'}     | ${'none'}     | ${''}       | ${''}
		${'6.02*23 mols'}     | ${'none'}     | ${''}       | ${''}
		${"6.02''23 mols"}    | ${'none'}     | ${''}       | ${''}
		${'6.02^23 mols'}     | ${'none'}     | ${''}       | ${''}
		${'6.02e23mols'}      | ${'none'}     | ${''}       | ${''}
		${'6.02x10^23mols'}   | ${'none'}     | ${''}       | ${''}
		${'6.02*10^23mols'}   | ${'none'}     | ${''}       | ${''}
		${"6.02'23mols"}      | ${'none'}     | ${''}       | ${''}
		${'6.02ee23mols'}     | ${'none'}     | ${''}       | ${''}
		${'6.02mols'}         | ${'none'}     | ${''}       | ${''}
		${'6.02e10^23mols'}   | ${'none'}     | ${''}       | ${''}
		${'6.02ee10^23mols'}  | ${'none'}     | ${''}       | ${''}
		${'6.02x23mols'}      | ${'none'}     | ${''}       | ${''}
		${'6.02*23mols'}      | ${'none'}     | ${''}       | ${''}
		${"6.02''23mols"}     | ${'none'}     | ${''}       | ${''}
		${'6.02^23mols'}      | ${'none'}     | ${''}       | ${''}
		${'0b0'}              | ${'exact'}    | ${'0b0'}    | ${''}
		${'0b1'}              | ${'exact'}    | ${'0b1'}    | ${''}
		${'0b1011'}           | ${'exact'}    | ${'0b1011'} | ${''}
		${'0'}                | ${'inferred'} | ${'0'}      | ${''}
		${'1'}                | ${'inferred'} | ${'1'}      | ${''}
		${'1011'}             | ${'inferred'} | ${'1011'}   | ${''}
		${'0b2'}              | ${'none'}     | ${''}       | ${''}
		${'2'}                | ${'none'}     | ${''}       | ${''}
		${'0b0 bytes'}        | ${'exact'}    | ${'0b0'}    | ${'bytes'}
		${'0b1 bytes'}        | ${'exact'}    | ${'0b1'}    | ${'bytes'}
		${'0b1011 bytes'}     | ${'exact'}    | ${'0b1011'} | ${'bytes'}
		${'0 bytes'}          | ${'inferred'} | ${'0'}      | ${'bytes'}
		${'1 bytes'}          | ${'inferred'} | ${'1'}      | ${'bytes'}
		${'1011 bytes'}       | ${'inferred'} | ${'1011'}   | ${'bytes'}
		${'0b2 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'2 bytes'}          | ${'none'}     | ${''}       | ${''}
		${'-0b0'}             | ${'none'}     | ${''}       | ${''}
		${'-0b1 bytes'}       | ${'none'}     | ${''}       | ${''}
		${'-0'}               | ${'none'}     | ${''}       | ${''}
		${'-01 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0b0bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0b1bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0b1011bytes'}      | ${'none'}     | ${''}       | ${''}
		${'0bytes'}           | ${'none'}     | ${''}       | ${''}
		${'1bytes'}           | ${'none'}     | ${''}       | ${''}
		${'1011bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0b2bytes'}         | ${'none'}     | ${''}       | ${''}
		${'2bytes'}           | ${'none'}     | ${''}       | ${''}
		${'-0b0'}             | ${'none'}     | ${''}       | ${''}
		${'-0b1bytes'}        | ${'none'}     | ${''}       | ${''}
		${'-0'}               | ${'none'}     | ${''}       | ${''}
		${'-01bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0o0'}              | ${'none'}     | ${''}       | ${''}
		${'0o1'}              | ${'none'}     | ${''}       | ${''}
		${'0o7'}              | ${'none'}     | ${''}       | ${''}
		${'0o8'}              | ${'none'}     | ${''}       | ${''}
		${'0o777'}            | ${'none'}     | ${''}       | ${''}
		${'0o781'}            | ${'none'}     | ${''}       | ${''}
		${'7'}                | ${'none'}     | ${''}       | ${''}
		${'8'}                | ${'none'}     | ${''}       | ${''}
		${'0o0 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0o1 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0o7 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0o8 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0o777 bytes'}      | ${'none'}     | ${''}       | ${''}
		${'0o781 bytes'}      | ${'none'}     | ${''}       | ${''}
		${'7 bytes'}          | ${'none'}     | ${''}       | ${''}
		${'8 bytes'}          | ${'none'}     | ${''}       | ${''}
		${'0o0bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0o1bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0o7bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0o8bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0o777bytes'}       | ${'none'}     | ${''}       | ${''}
		${'0o781bytes'}       | ${'none'}     | ${''}       | ${''}
		${'7bytes'}           | ${'none'}     | ${''}       | ${''}
		${'8bytes'}           | ${'none'}     | ${''}       | ${''}
		${'0x0'}              | ${'none'}     | ${''}       | ${''}
		${'0x0F'}             | ${'none'}     | ${''}       | ${''}
		${'0xfa'}             | ${'none'}     | ${''}       | ${''}
		${'-0xfa'}            | ${'none'}     | ${''}       | ${''}
		${'+0xfa'}            | ${'none'}     | ${''}       | ${''}
		${'0xG6'}             | ${'none'}     | ${''}       | ${''}
		${'#0'}               | ${'none'}     | ${''}       | ${''}
		${'#DEADBEEF'}        | ${'none'}     | ${''}       | ${''}
		${'#692B'}            | ${'none'}     | ${''}       | ${''}
		${'-#692B'}           | ${'none'}     | ${''}       | ${''}
		${'+#692B'}           | ${'none'}     | ${''}       | ${''}
		${'#ZAP'}             | ${'none'}     | ${''}       | ${''}
		${'$0'}               | ${'none'}     | ${''}       | ${''}
		${'$CCC'}             | ${'none'}     | ${''}       | ${''}
		${'$bAdFaD'}          | ${'none'}     | ${''}       | ${''}
		${'-$bAdFaD'}         | ${'none'}     | ${''}       | ${''}
		${'+$bAdFaD'}         | ${'none'}     | ${''}       | ${''}
		${'$HEX'}             | ${'none'}     | ${''}       | ${''}
		${'B'}                | ${'none'}     | ${''}       | ${''}
		${'0F'}               | ${'none'}     | ${''}       | ${''}
		${'F0'}               | ${'none'}     | ${''}       | ${''}
		${'-F0'}              | ${'none'}     | ${''}       | ${''}
		${'+F0'}              | ${'none'}     | ${''}       | ${''}
		${'999A999'}          | ${'none'}     | ${''}       | ${''}
		${'999H999'}          | ${'none'}     | ${''}       | ${''}
		${'0'}                | ${'inferred'} | ${'0'}      | ${''}
		${'6928'}             | ${'none'}     | ${''}       | ${''}
		${'-6928'}            | ${'none'}     | ${''}       | ${''}
		${'+6928'}            | ${'none'}     | ${''}       | ${''}
		${'0x0 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'0x0F bytes'}       | ${'none'}     | ${''}       | ${''}
		${'0xfa bytes'}       | ${'none'}     | ${''}       | ${''}
		${'-0xfa bytes'}      | ${'none'}     | ${''}       | ${''}
		${'+0xfa bytes'}      | ${'none'}     | ${''}       | ${''}
		${'0xG6 bytes'}       | ${'none'}     | ${''}       | ${''}
		${'#0 bytes'}         | ${'none'}     | ${''}       | ${''}
		${'#DEADBEEF bytes'}  | ${'none'}     | ${''}       | ${''}
		${'#692B bytes'}      | ${'none'}     | ${''}       | ${''}
		${'-#692B bytes'}     | ${'none'}     | ${''}       | ${''}
		${'+#692B bytes'}     | ${'none'}     | ${''}       | ${''}
		${'#ZAP bytes'}       | ${'none'}     | ${''}       | ${''}
		${'$0 bytes'}         | ${'none'}     | ${''}       | ${''}
		${'$CCC bytes'}       | ${'none'}     | ${''}       | ${''}
		${'$bAdFaD bytes'}    | ${'none'}     | ${''}       | ${''}
		${'-$bAdFaD bytes'}   | ${'none'}     | ${''}       | ${''}
		${'+$bAdFaD bytes'}   | ${'none'}     | ${''}       | ${''}
		${'$HEX bytes'}       | ${'none'}     | ${''}       | ${''}
		${'B bytes'}          | ${'none'}     | ${''}       | ${''}
		${'0F bytes'}         | ${'none'}     | ${''}       | ${''}
		${'F0 bytes'}         | ${'none'}     | ${''}       | ${''}
		${'-F0 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'+F0 bytes'}        | ${'none'}     | ${''}       | ${''}
		${'999A999 bytes'}    | ${'none'}     | ${''}       | ${''}
		${'999H999 bytes'}    | ${'none'}     | ${''}       | ${''}
		${'0 bytes'}          | ${'inferred'} | ${'0'}      | ${'bytes'}
		${'6928 bytes'}       | ${'none'}     | ${''}       | ${''}
		${'-6928 bytes'}      | ${'none'}     | ${''}       | ${''}
		${'+6928 bytes'}      | ${'none'}     | ${''}       | ${''}
		${'0x0bytes'}         | ${'none'}     | ${''}       | ${''}
		${'0x0Fbytes'}        | ${'none'}     | ${''}       | ${''}
		${'0xfabytes'}        | ${'none'}     | ${''}       | ${''}
		${'-0xfabytes'}       | ${'none'}     | ${''}       | ${''}
		${'+0xfabytes'}       | ${'none'}     | ${''}       | ${''}
		${'0xG6bytes'}        | ${'none'}     | ${''}       | ${''}
		${'#0bytes'}          | ${'none'}     | ${''}       | ${''}
		${'#DEADBEEFbytes'}   | ${'none'}     | ${''}       | ${''}
		${'#692Bbytes'}       | ${'none'}     | ${''}       | ${''}
		${'-#692Bbytes'}      | ${'none'}     | ${''}       | ${''}
		${'+#692Bbytes'}      | ${'none'}     | ${''}       | ${''}
		${'#ZAPbytes'}        | ${'none'}     | ${''}       | ${''}
		${'$0bytes'}          | ${'none'}     | ${''}       | ${''}
		${'$CCCbytes'}        | ${'none'}     | ${''}       | ${''}
		${'$bAdFaDbytes'}     | ${'none'}     | ${''}       | ${''}
		${'-$bAdFaDbytes'}    | ${'none'}     | ${''}       | ${''}
		${'+$bAdFaDbytes'}    | ${'none'}     | ${''}       | ${''}
		${'$HEXbytes'}        | ${'none'}     | ${''}       | ${''}
		${'Bbytes'}           | ${'none'}     | ${''}       | ${''}
		${'0Fbytes'}          | ${'none'}     | ${''}       | ${''}
		${'F0bytes'}          | ${'none'}     | ${''}       | ${''}
		${'-F0bytes'}         | ${'none'}     | ${''}       | ${''}
		${'+F0bytes'}         | ${'none'}     | ${''}       | ${''}
		${'999A999bytes'}     | ${'none'}     | ${''}       | ${''}
		${'999H999bytes'}     | ${'none'}     | ${''}       | ${''}
		${'0bytes'}           | ${'none'}     | ${''}       | ${''}
		${'6928bytes'}        | ${'none'}     | ${''}       | ${''}
		${'-6928bytes'}       | ${'none'}     | ${''}       | ${''}
		${'+6928bytes'}       | ${'none'}     | ${''}       | ${''}
	`(`parse($input)={$matchType,$valueString,$unit}`, ({ input, matchType, valueString, unit }) => {
		expect(Binary.parse(input)).toEqual({ matchType, valueString, unit })
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

	test('getBigValue returns a Big instance of Binary.getValue', () => {
		expect(Binary.getBigValue('0b101010')).toEqual(Big(0b101010))
	})

	test('getValue returns the number of a given string', () => {
		expect(Binary.getValue('0b101010')).toBe(42)
		expect(Binary.getValue('101010')).toBe(42)
	})

	test('getNumSigFigs calls Decimal.getNumSigFigs', () => {
		const mockString = jest.fn()
		const getBigValueSpy = jest.spyOn(Binary, 'getBigValue').mockReturnValue({
			toString: () => mockString
		})
		const decimalSpy = jest.spyOn(Decimal, 'getNumSigFigs').mockImplementation(i => i)

		const result = Binary.getNumSigFigs('mock-string')

		expect(getBigValueSpy).toHaveBeenCalledWith('mock-string')
		expect(result).toBe(mockString)

		getBigValueSpy.mockRestore()
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
