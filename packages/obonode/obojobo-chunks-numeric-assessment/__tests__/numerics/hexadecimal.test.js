import Hexadecimal from '../../numerics/Hexadecimal'
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
		input                | expected
		${'0x0'}             | ${'0x0'}
		${'0x0F'}            | ${'0x0F'}
		${'0xfa'}            | ${'0xfa'}
		${'-0xfa'}           | ${null}
		${'+0xfa'}           | ${null}
		${'0xG6'}            | ${null}
		${'#0'}              | ${'#0'}
		${'#DEADBEEF'}       | ${'#DEADBEEF'}
		${'#692B'}           | ${'#692B'}
		${'-#692B'}          | ${null}
		${'+#692B'}          | ${null}
		${'#ZAP'}            | ${null}
		${'$0'}              | ${'$0'}
		${'$CCC'}            | ${'$CCC'}
		${'$bAdFaD'}         | ${'$bAdFaD'}
		${'-$bAdFaD'}        | ${null}
		${'+$bAdFaD'}        | ${null}
		${'$HEX'}            | ${null}
		${'B'}               | ${'B'}
		${'0F'}              | ${'0F'}
		${'F0'}              | ${'F0'}
		${'-F0'}             | ${null}
		${'+F0'}             | ${null}
		${'999A999'}         | ${'999A999'}
		${'999H999'}         | ${null}
		${'0'}               | ${'0'}
		${'6928'}            | ${'6928'}
		${'-6928'}           | ${null}
		${'+6928'}           | ${null}
		${'0x0 bytes'}       | ${'0x0'}
		${'0x0F bytes'}      | ${'0x0F'}
		${'0xfa bytes'}      | ${'0xfa'}
		${'-0xfa bytes'}     | ${null}
		${'+0xfa bytes'}     | ${null}
		${'0xG6 bytes'}      | ${null}
		${'#0 bytes'}        | ${'#0'}
		${'#DEADBEEF bytes'} | ${'#DEADBEEF'}
		${'#692B bytes'}     | ${'#692B'}
		${'-#692B bytes'}    | ${null}
		${'+#692B bytes'}    | ${null}
		${'#ZAP bytes'}      | ${null}
		${'$0 bytes'}        | ${'$0'}
		${'$CCC bytes'}      | ${'$CCC'}
		${'$bAdFaD bytes'}   | ${'$bAdFaD'}
		${'-$bAdFaD bytes'}  | ${null}
		${'+$bAdFaD bytes'}  | ${null}
		${'$HEX bytes'}      | ${null}
		${'B bytes'}         | ${'B'}
		${'0F bytes'}        | ${'0F'}
		${'F0 bytes'}        | ${'F0'}
		${'-F0 bytes'}       | ${null}
		${'+F0 bytes'}       | ${null}
		${'999A999 bytes'}   | ${'999A999'}
		${'999H999 bytes'}   | ${null}
		${'0 bytes'}         | ${'0'}
		${'6928 bytes'}      | ${'6928'}
		${'-6928 bytes'}     | ${null}
		${'+6928 bytes'}     | ${null}
		${'0x0bytes'}        | ${null}
		${'0x0Fbytes'}       | ${null}
		${'0xfabytes'}       | ${null}
		${'-0xfabytes'}      | ${null}
		${'+0xfabytes'}      | ${null}
		${'0xG6bytes'}       | ${null}
		${'#0bytes'}         | ${null}
		${'#DEADBEEFbytes'}  | ${null}
		${'#692Bbytes'}      | ${null}
		${'-#692Bbytes'}     | ${null}
		${'+#692Bbytes'}     | ${null}
		${'#ZAPbytes'}       | ${null}
		${'$0bytes'}         | ${null}
		${'$CCCbytes'}       | ${null}
		${'$bAdFaDbytes'}    | ${null}
		${'-$bAdFaDbytes'}   | ${null}
		${'+$bAdFaDbytes'}   | ${null}
		${'$HEXbytes'}       | ${null}
		${'Bbytes'}          | ${null}
		${'0Fbytes'}         | ${null}
		${'F0bytes'}         | ${null}
		${'-F0bytes'}        | ${null}
		${'+F0bytes'}        | ${null}
		${'999A999bytes'}    | ${null}
		${'999H999bytes'}    | ${null}
		${'0bytes'}          | ${null}
		${'6928bytes'}       | ${null}
		${'-6928bytes'}      | ${null}
		${'+6928bytes'}      | ${null}
	`(`getValueString($input)=$expected`, ({ input, expected }) => {
		expect(Hexadecimal.getValueString(input)).toBe(expected)
	})
	////

	test.each`
		input                 | matchType     | valueString    | unit
		${'0'}                | ${'inferred'} | ${'0'}         | ${''}
		${'000000'}           | ${'inferred'} | ${'000000'}    | ${''}
		${'-0g'}              | ${'none'}     | ${''}          | ${''}
		${'0.0 g'}            | ${'none'}     | ${''}          | ${''}
		${'0.'}               | ${'none'}     | ${''}          | ${''}
		${'-0.Miles'}         | ${'none'}     | ${''}          | ${''}
		${'-.0 Miles'}        | ${'none'}     | ${''}          | ${''}
		${'+.0'}              | ${'none'}     | ${''}          | ${''}
		${'2kCal'}            | ${'none'}     | ${''}          | ${''}
		${'-2 kCal'}          | ${'none'}     | ${''}          | ${''}
		${'1.21 Ω'}           | ${'none'}     | ${''}          | ${''}
		${'99.9%'}            | ${'none'}     | ${''}          | ${''}
		${'-.2'}              | ${'none'}     | ${''}          | ${''}
		${'1/2'}              | ${'none'}     | ${''}          | ${''}
		${'0/2'}              | ${'none'}     | ${''}          | ${''}
		${'-0/2g'}            | ${'none'}     | ${''}          | ${''}
		${'6/6 g'}            | ${'none'}     | ${''}          | ${''}
		${'6.6/6'}            | ${'none'}     | ${''}          | ${''}
		${'9/2Miles'}         | ${'none'}     | ${''}          | ${''}
		${'-9/2 Miles'}       | ${'none'}     | ${''}          | ${''}
		${'+33/22'}           | ${'none'}     | ${''}          | ${''}
		${'2/2kCal'}          | ${'none'}     | ${''}          | ${''}
		${'-2/2 kCal'}        | ${'none'}     | ${''}          | ${''}
		${'1/21 Ω'}           | ${'none'}     | ${''}          | ${''}
		${'99/9%'}            | ${'none'}     | ${''}          | ${''}
		${'-0/0'}             | ${'none'}     | ${''}          | ${''}
		${'6.02e23'}          | ${'none'}     | ${''}          | ${''}
		${'60.2e23'}          | ${'none'}     | ${''}          | ${''}
		${'6.02e2.3'}         | ${'none'}     | ${''}          | ${''}
		${'60.2x10^23'}       | ${'none'}     | ${''}          | ${''}
		${'6*10^23'}          | ${'none'}     | ${''}          | ${''}
		${"-6.02'23"}         | ${'none'}     | ${''}          | ${''}
		${'-6.02ee-23'}       | ${'none'}     | ${''}          | ${''}
		${'+6.02e+23 mols'}   | ${'none'}     | ${''}          | ${''}
		${'6.02x10^23 mols'}  | ${'none'}     | ${''}          | ${''}
		${'6.02*10^23 mols'}  | ${'none'}     | ${''}          | ${''}
		${"6.02'23 mols"}     | ${'none'}     | ${''}          | ${''}
		${'6.02ee23 mols'}    | ${'none'}     | ${''}          | ${''}
		${'6.02e10^23 mols'}  | ${'none'}     | ${''}          | ${''}
		${'6.02ee10^23 mols'} | ${'none'}     | ${''}          | ${''}
		${'6.02x23 mols'}     | ${'none'}     | ${''}          | ${''}
		${'6.02*23 mols'}     | ${'none'}     | ${''}          | ${''}
		${"6.02''23 mols"}    | ${'none'}     | ${''}          | ${''}
		${'6.02^23 mols'}     | ${'none'}     | ${''}          | ${''}
		${'6.02e23mols'}      | ${'none'}     | ${''}          | ${''}
		${'6.02x10^23mols'}   | ${'none'}     | ${''}          | ${''}
		${'6.02*10^23mols'}   | ${'none'}     | ${''}          | ${''}
		${"6.02'23mols"}      | ${'none'}     | ${''}          | ${''}
		${'6.02ee23mols'}     | ${'none'}     | ${''}          | ${''}
		${'6.02mols'}         | ${'none'}     | ${''}          | ${''}
		${'6.02e10^23mols'}   | ${'none'}     | ${''}          | ${''}
		${'6.02ee10^23mols'}  | ${'none'}     | ${''}          | ${''}
		${'6.02x23mols'}      | ${'none'}     | ${''}          | ${''}
		${'6.02*23mols'}      | ${'none'}     | ${''}          | ${''}
		${"6.02''23mols"}     | ${'none'}     | ${''}          | ${''}
		${'6.02^23mols'}      | ${'none'}     | ${''}          | ${''}
		${'0b0'}              | ${'inferred'} | ${'0b0'}       | ${''}
		${'0b1'}              | ${'inferred'} | ${'0b1'}       | ${''}
		${'0b1011'}           | ${'inferred'} | ${'0b1011'}    | ${''}
		${'0'}                | ${'inferred'} | ${'0'}         | ${''}
		${'1'}                | ${'inferred'} | ${'1'}         | ${''}
		${'1011'}             | ${'inferred'} | ${'1011'}      | ${''}
		${'0b2'}              | ${'inferred'} | ${'0b2'}       | ${''}
		${'2'}                | ${'inferred'} | ${'2'}         | ${''}
		${'0b0 bytes'}        | ${'inferred'} | ${'0b0'}       | ${'bytes'}
		${'0b1 bytes'}        | ${'inferred'} | ${'0b1'}       | ${'bytes'}
		${'0b1011 bytes'}     | ${'inferred'} | ${'0b1011'}    | ${'bytes'}
		${'0 bytes'}          | ${'inferred'} | ${'0'}         | ${'bytes'}
		${'1 bytes'}          | ${'inferred'} | ${'1'}         | ${'bytes'}
		${'1011 bytes'}       | ${'inferred'} | ${'1011'}      | ${'bytes'}
		${'0b2 bytes'}        | ${'inferred'} | ${'0b2'}       | ${'bytes'}
		${'2 bytes'}          | ${'inferred'} | ${'2'}         | ${'bytes'}
		${'-0b0'}             | ${'none'}     | ${''}          | ${''}
		${'-0b1 bytes'}       | ${'none'}     | ${''}          | ${''}
		${'-0'}               | ${'none'}     | ${''}          | ${''}
		${'-01 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'0b0bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0b1bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0b1011bytes'}      | ${'none'}     | ${''}          | ${''}
		${'0bytes'}           | ${'none'}     | ${''}          | ${''}
		${'1bytes'}           | ${'none'}     | ${''}          | ${''}
		${'1011bytes'}        | ${'none'}     | ${''}          | ${''}
		${'0b2bytes'}         | ${'none'}     | ${''}          | ${''}
		${'2bytes'}           | ${'none'}     | ${''}          | ${''}
		${'-0b0'}             | ${'none'}     | ${''}          | ${''}
		${'-0b1bytes'}        | ${'none'}     | ${''}          | ${''}
		${'-0'}               | ${'none'}     | ${''}          | ${''}
		${'-01bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0o0'}              | ${'none'}     | ${''}          | ${''}
		${'0o1'}              | ${'none'}     | ${''}          | ${''}
		${'0o7'}              | ${'none'}     | ${''}          | ${''}
		${'0o8'}              | ${'none'}     | ${''}          | ${''}
		${'0o777'}            | ${'none'}     | ${''}          | ${''}
		${'0o781'}            | ${'none'}     | ${''}          | ${''}
		${'7'}                | ${'inferred'} | ${'7'}         | ${''}
		${'8'}                | ${'inferred'} | ${'8'}         | ${''}
		${'0o0 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'0o1 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'0o7 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'0o8 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'0o777 bytes'}      | ${'none'}     | ${''}          | ${''}
		${'0o781 bytes'}      | ${'none'}     | ${''}          | ${''}
		${'7 bytes'}          | ${'inferred'} | ${'7'}         | ${'bytes'}
		${'8 bytes'}          | ${'inferred'} | ${'8'}         | ${'bytes'}
		${'0o0bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0o1bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0o7bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0o8bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0o777bytes'}       | ${'none'}     | ${''}          | ${''}
		${'0o781bytes'}       | ${'none'}     | ${''}          | ${''}
		${'7bytes'}           | ${'none'}     | ${''}          | ${''}
		${'8bytes'}           | ${'none'}     | ${''}          | ${''}
		${'0x0'}              | ${'exact'}    | ${'0x0'}       | ${''}
		${'0x0F'}             | ${'exact'}    | ${'0x0F'}      | ${''}
		${'0xfa'}             | ${'exact'}    | ${'0xfa'}      | ${''}
		${'-0xfa'}            | ${'none'}     | ${''}          | ${''}
		${'+0xfa'}            | ${'none'}     | ${''}          | ${''}
		${'0xG6'}             | ${'none'}     | ${''}          | ${''}
		${'#0'}               | ${'exact'}    | ${'#0'}        | ${''}
		${'#DEADBEEF'}        | ${'exact'}    | ${'#DEADBEEF'} | ${''}
		${'#692B'}            | ${'exact'}    | ${'#692B'}     | ${''}
		${'-#692B'}           | ${'none'}     | ${''}          | ${''}
		${'+#692B'}           | ${'none'}     | ${''}          | ${''}
		${'#ZAP'}             | ${'none'}     | ${''}          | ${''}
		${'$0'}               | ${'exact'}    | ${'$0'}        | ${''}
		${'$CCC'}             | ${'exact'}    | ${'$CCC'}      | ${''}
		${'$bAdFaD'}          | ${'exact'}    | ${'$bAdFaD'}   | ${''}
		${'-$bAdFaD'}         | ${'none'}     | ${''}          | ${''}
		${'+$bAdFaD'}         | ${'none'}     | ${''}          | ${''}
		${'$HEX'}             | ${'none'}     | ${''}          | ${''}
		${'B'}                | ${'inferred'} | ${'B'}         | ${''}
		${'0F'}               | ${'inferred'} | ${'0F'}        | ${''}
		${'F0'}               | ${'inferred'} | ${'F0'}        | ${''}
		${'-F0'}              | ${'none'}     | ${''}          | ${''}
		${'+F0'}              | ${'none'}     | ${''}          | ${''}
		${'999A999'}          | ${'inferred'} | ${'999A999'}   | ${''}
		${'999H999'}          | ${'none'}     | ${''}          | ${''}
		${'0'}                | ${'inferred'} | ${'0'}         | ${''}
		${'6928'}             | ${'inferred'} | ${'6928'}      | ${''}
		${'-6928'}            | ${'none'}     | ${''}          | ${''}
		${'+6928'}            | ${'none'}     | ${''}          | ${''}
		${'0x0 bytes'}        | ${'exact'}    | ${'0x0'}       | ${'bytes'}
		${'0x0F bytes'}       | ${'exact'}    | ${'0x0F'}      | ${'bytes'}
		${'0xfa bytes'}       | ${'exact'}    | ${'0xfa'}      | ${'bytes'}
		${'-0xfa bytes'}      | ${'none'}     | ${''}          | ${''}
		${'+0xfa bytes'}      | ${'none'}     | ${''}          | ${''}
		${'0xG6 bytes'}       | ${'none'}     | ${''}          | ${''}
		${'#0 bytes'}         | ${'exact'}    | ${'#0'}        | ${'bytes'}
		${'#DEADBEEF bytes'}  | ${'exact'}    | ${'#DEADBEEF'} | ${'bytes'}
		${'#692B bytes'}      | ${'exact'}    | ${'#692B'}     | ${'bytes'}
		${'-#692B bytes'}     | ${'none'}     | ${''}          | ${''}
		${'+#692B bytes'}     | ${'none'}     | ${''}          | ${''}
		${'#ZAP bytes'}       | ${'none'}     | ${''}          | ${''}
		${'$0 bytes'}         | ${'exact'}    | ${'$0'}        | ${'bytes'}
		${'$CCC bytes'}       | ${'exact'}    | ${'$CCC'}      | ${'bytes'}
		${'$bAdFaD bytes'}    | ${'exact'}    | ${'$bAdFaD'}   | ${'bytes'}
		${'-$bAdFaD bytes'}   | ${'none'}     | ${''}          | ${''}
		${'+$bAdFaD bytes'}   | ${'none'}     | ${''}          | ${''}
		${'$HEX bytes'}       | ${'none'}     | ${''}          | ${''}
		${'B bytes'}          | ${'inferred'} | ${'B'}         | ${'bytes'}
		${'0F bytes'}         | ${'inferred'} | ${'0F'}        | ${'bytes'}
		${'F0 bytes'}         | ${'inferred'} | ${'F0'}        | ${'bytes'}
		${'-F0 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'+F0 bytes'}        | ${'none'}     | ${''}          | ${''}
		${'999A999 bytes'}    | ${'inferred'} | ${'999A999'}   | ${'bytes'}
		${'999H999 bytes'}    | ${'none'}     | ${''}          | ${''}
		${'0 bytes'}          | ${'inferred'} | ${'0'}         | ${'bytes'}
		${'6928 bytes'}       | ${'inferred'} | ${'6928'}      | ${'bytes'}
		${'-6928 bytes'}      | ${'none'}     | ${''}          | ${''}
		${'+6928 bytes'}      | ${'none'}     | ${''}          | ${''}
		${'0x0bytes'}         | ${'none'}     | ${''}          | ${''}
		${'0x0Fbytes'}        | ${'none'}     | ${''}          | ${''}
		${'0xfabytes'}        | ${'none'}     | ${''}          | ${''}
		${'-0xfabytes'}       | ${'none'}     | ${''}          | ${''}
		${'+0xfabytes'}       | ${'none'}     | ${''}          | ${''}
		${'0xG6bytes'}        | ${'none'}     | ${''}          | ${''}
		${'#0bytes'}          | ${'none'}     | ${''}          | ${''}
		${'#DEADBEEFbytes'}   | ${'none'}     | ${''}          | ${''}
		${'#692Bbytes'}       | ${'none'}     | ${''}          | ${''}
		${'-#692Bbytes'}      | ${'none'}     | ${''}          | ${''}
		${'+#692Bbytes'}      | ${'none'}     | ${''}          | ${''}
		${'#ZAPbytes'}        | ${'none'}     | ${''}          | ${''}
		${'$0bytes'}          | ${'none'}     | ${''}          | ${''}
		${'$CCCbytes'}        | ${'none'}     | ${''}          | ${''}
		${'$bAdFaDbytes'}     | ${'none'}     | ${''}          | ${''}
		${'-$bAdFaDbytes'}    | ${'none'}     | ${''}          | ${''}
		${'+$bAdFaDbytes'}    | ${'none'}     | ${''}          | ${''}
		${'$HEXbytes'}        | ${'none'}     | ${''}          | ${''}
		${'Bbytes'}           | ${'none'}     | ${''}          | ${''}
		${'0Fbytes'}          | ${'none'}     | ${''}          | ${''}
		${'F0bytes'}          | ${'none'}     | ${''}          | ${''}
		${'-F0bytes'}         | ${'none'}     | ${''}          | ${''}
		${'+F0bytes'}         | ${'none'}     | ${''}          | ${''}
		${'999A999bytes'}     | ${'none'}     | ${''}          | ${''}
		${'999H999bytes'}     | ${'none'}     | ${''}          | ${''}
		${'0bytes'}           | ${'none'}     | ${''}          | ${''}
		${'6928bytes'}        | ${'none'}     | ${''}          | ${''}
		${'-6928bytes'}       | ${'none'}     | ${''}          | ${''}
		${'+6928bytes'}       | ${'none'}     | ${''}          | ${''}
	`(`parse($input)={$matchType,$valueString,$unit}`, ({ input, matchType, valueString, unit }) => {
		expect(Hexadecimal.parse(input)).toEqual({ matchType, valueString, unit })
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

	test('getBigValue returns a Big instance of Hexadecimal.getValue', () => {
		expect(Hexadecimal.getBigValue('0x2A')).toEqual(Big(0x2a))
	})

	test('getValue returns the number of a given string', () => {
		expect(Hexadecimal.getValue('0x2A')).toBe(42)
		expect(Hexadecimal.getValue('#2A')).toBe(42)
		expect(Hexadecimal.getValue('$2A')).toBe(42)
		expect(Hexadecimal.getValue('2A')).toBe(42)
		expect(Hexadecimal.getValue('29')).toBe(41)
	})

	test('getNumSigFigs calls Decimal.getNumSigFigs', () => {
		const mockString = jest.fn()
		const getBigValueSpy = jest.spyOn(Hexadecimal, 'getBigValue').mockReturnValue({
			toString: () => mockString
		})
		const decimalSpy = jest.spyOn(Decimal, 'getNumSigFigs').mockImplementation(i => i)

		const result = Hexadecimal.getNumSigFigs('mock-string')

		expect(getBigValueSpy).toHaveBeenCalledWith('mock-string')
		expect(result).toBe(mockString)

		getBigValueSpy.mockRestore()
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
