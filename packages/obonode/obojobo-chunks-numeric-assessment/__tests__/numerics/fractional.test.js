import Fractional from '../../numerics/fractional'
import Big from 'big.js'
import getPercentError from '../../util/percent-error'
import Numeric from '../../numerics/numeric'

jest.mock('../../util/percent-error')

describe('Fractional', () => {
	test('get type returns expected type', () => {
		expect(Fractional.type).toEqual('fractional')
	})

	test('get label returns expected string', () => {
		expect(Fractional.label).toEqual('Fraction')
	})

	test('isSafe returns true', () => {
		expect(Fractional.isSafe()).toBe(true)
	})

	test('getBigValue returns the bigValue property from terms', () => {
		const mockBigValue = jest.fn()
		const getTermsSpy = jest
			.spyOn(Fractional, 'getTerms')
			.mockReturnValue({ bigValue: mockBigValue })

		expect(Fractional.getBigValue('mock-string')).toBe(mockBigValue)

		getTermsSpy.mockRestore()
	})

	test('getRoundedBigValue simply returns a copy of the big value', () => {
		const b = new Big(123)
		const r = Fractional.getRoundedBigValue(b)

		expect(b).not.toBe(r)
		expect(b).toEqual(r)
	})

	test('getBigValueReducedTerms calls getReducedTerms on getBigValueFractionsTerms', () => {
		const mockN = jest.fn()
		const mockD = jest.fn()
		const getBigValueFractionTermsSpy = jest
			.spyOn(Fractional, 'getBigValueFractionTerms')
			.mockImplementation(() => ({ bigNumerator: mockN, bigDenominator: mockD }))
		const getReducedTermsSpy = jest
			.spyOn(Fractional, 'getReducedTerms')
			.mockImplementation(jest.fn())

		Fractional.getBigValueReducedTerms(jest.fn())

		expect(getReducedTermsSpy).toHaveBeenCalledWith(mockN, mockD)

		getBigValueFractionTermsSpy.mockRestore()
		getReducedTermsSpy.mockRestore()
	})

	test.each`
		a       | b        | expected
		${2}    | ${-4}    | ${2}
		${2}    | ${8}     | ${2}
		${-4}   | ${-8}    | ${4}
		${27}   | ${9}     | ${9}
		${-7}   | ${11}    | ${1}
		${999}  | ${0}     | ${999}
		${-168} | ${-1617} | ${21}
		${100}  | ${80}    | ${20}
	`(`getGCD($a,$b)=$expected`, ({ a, b, expected }) => {
		expect(Fractional.getGCD(Big(a), Big(b))).toEqual(Big(expected))
	})

	test('getReducedTerms divides terms by GCD', () => {
		const mockGCD = jest.fn()
		const gcdSpy = jest.spyOn(Fractional, 'getGCD').mockReturnValue(mockGCD)

		const n = { div: jest.fn(() => 'n') }
		const d = { div: jest.fn(() => 'd') }
		expect(Fractional.getReducedTerms(n, d)).toEqual({
			bigNumerator: 'n',
			bigDenominator: 'd'
		})
		expect(n.div).toHaveBeenCalledWith(mockGCD)
		expect(d.div).toHaveBeenCalledWith(mockGCD)

		gcdSpy.mockRestore()
	})

	test.each`
		input       | expected
		${2}        | ${'2/1'}
		${-1}       | ${'-1/1'}
		${0.5}      | ${'1/2'}
		${0.4}      | ${'2/5'}
		${-0.25}    | ${'-1/4'}
		${0.125}    | ${'1/8'}
		${3.14}     | ${'157/50'}
		${0}        | ${'0/1'}
		${1}        | ${'1/1'}
		${0.333333} | ${'1/3'}
		${0.666666} | ${'2/3'}
		${0.666667} | ${'2/3'}
		${0.33333}  | ${'25641/76924'}
		${0.66666}  | ${'28987/43481'}
		${0.166666} | ${'1/6'}
		${0.111}    | ${'111/1000'}
		${0.1}      | ${'1/10'}
		${0.01}     | ${'1/100'}
		${0.001}    | ${'1/1000'}
	`(`getString($input)=$expected`, ({ input, expected }) => {
		expect(Fractional.getString(Big(input))).toBe(expected)
	})

	test.each`
		input            | expected
		${'2/1'}         | ${true}
		${'-1/1'}        | ${true}
		${'1/2'}         | ${false}
		${'2/5'}         | ${false}
		${'-1/4'}        | ${false}
		${'1/8'}         | ${false}
		${'157/50'}      | ${false}
		${'0/1'}         | ${true}
		${'1/1'}         | ${true}
		${'1/3'}         | ${false}
		${'2/3'}         | ${false}
		${'2/3'}         | ${false}
		${'25641/76924'} | ${false}
		${'28987/43481'} | ${false}
		${'1/6'}         | ${false}
		${'111/1000'}    | ${false}
		${'1/10'}        | ${false}
		${'1/100'}       | ${false}
		${'1/1000'}      | ${false}
		${'4/2'}         | ${true}
	`(`getIsInteger($input)=$expected`, ({ input, expected }) => {
		expect(Fractional.getIsInteger(input)).toBe(expected)
	})

	test('getReducedTerms divides both terms by the GCD', () => {
		const mockGCD = jest.fn()
		const getGCDSpy = jest.spyOn(Fractional, 'getGCD').mockReturnValue(mockGCD)
		const mockN = { div: jest.fn(() => 'n-result') }
		const mockD = { div: jest.fn(() => 'd-result') }

		Fractional.getReducedTerms(mockN, mockD)

		expect(Fractional.getReducedTerms(mockN, mockD)).toEqual({
			bigNumerator: 'n-result',
			bigDenominator: 'd-result'
		})
		expect(mockN.div).toHaveBeenCalledWith(mockGCD)
		expect(mockD.div).toHaveBeenCalledWith(mockGCD)

		getGCDSpy.mockRestore()
	})

	test.each`
		input          | n            | d
		${2}           | ${2}         | ${1}
		${-1}          | ${-1}        | ${1}
		${0.5}         | ${1}         | ${2}
		${0.4}         | ${2}         | ${5}
		${-0.25}       | ${-1}        | ${4}
		${0.125}       | ${1}         | ${8}
		${3.14}        | ${157}       | ${50}
		${0}           | ${0}         | ${1}
		${1}           | ${1}         | ${1}
		${0.333333}    | ${1}         | ${3}
		${0.666666}    | ${2}         | ${3}
		${0.666667}    | ${2}         | ${3}
		${0.33333}     | ${25641}     | ${76924}
		${0.66666}     | ${28987}     | ${43481}
		${0.111}       | ${111}       | ${1000}
		${0.1}         | ${1}         | ${10}
		${0.01}        | ${1}         | ${100}
		${0.001}       | ${1}         | ${1000}
		${0.000000001} | ${0}         | ${1}
		${100000000}   | ${100000000} | ${1}
	`(`getBigValueFractionTerms($input)=$expected`, ({ input, n, d }) => {
		expect(Fractional.getBigValueFractionTerms(Big(input))).toEqual({
			bigNumerator: Big(n),
			bigDenominator: Big(d)
		})
	})

	test('getBigValueFractionTerms allows custom error values', () => {
		expect(Fractional.getBigValueFractionTerms(Big(4.95), 0.1)).toEqual({
			bigNumerator: Big(5),
			bigDenominator: Big(1)
		})
	})

	test('getFractionStringPercentError returns a percent error for the fractional version of a Big value', () => {
		const getBigValueReducedTermsSpy = jest
			.spyOn(Fractional, 'getBigValueReducedTerms')
			.mockImplementation(() => ({ bigNumerator: Big(7), bigDenominator: Big(11) }))
		const mockBigValue = jest.fn()

		Fractional.getFractionStringPercentError(mockBigValue)
		expect(getPercentError).toHaveBeenCalledWith(Big(7).div(Big(11)), mockBigValue)

		getBigValueReducedTermsSpy.mockRestore()
	})

	test('getTerms gives Big values of a fractional string', () => {
		expect(Fractional.getTerms('7/11')).toEqual({
			bigNumerator: Big(7),
			bigDenominator: Big(11),
			bigValue: Big(7).div(Big(11))
		})
	})

	test('getIsReduced returns if the GCD of the terms of a fractional string is 1', () => {
		const mockN = jest.fn()
		const mockD = jest.fn()
		const getTermsSpy = jest
			.spyOn(Fractional, 'getTerms')
			.mockReturnValue({ bigNumerator: mockN, bigDenominator: mockD })
		const getGCDSpy = jest.spyOn(Fractional, 'getGCD').mockReturnValue(Big(1))

		expect(Fractional.getIsReduced(jest.fn())).toBe(true)
		expect(getGCDSpy).toHaveBeenCalledWith(mockN, mockD)
		getGCDSpy.mockReturnValue(Big(0))
		expect(Fractional.getIsReduced(jest.fn())).toBe(false)
		expect(getGCDSpy).toHaveBeenCalledWith(mockN, mockD)

		getTermsSpy.mockRestore()
		getGCDSpy.mockRestore()
	})

	test.each`
		input                 | matchType  | valueString | unit
		${'0'}                | ${'none'}  | ${''}       | ${''}
		${'000000'}           | ${'none'}  | ${''}       | ${''}
		${'-0g'}              | ${'none'}  | ${''}       | ${''}
		${'0.0 g'}            | ${'none'}  | ${''}       | ${''}
		${'0.'}               | ${'none'}  | ${''}       | ${''}
		${'-0.Miles'}         | ${'none'}  | ${''}       | ${''}
		${'-.0 Miles'}        | ${'none'}  | ${''}       | ${''}
		${'+.0'}              | ${'none'}  | ${''}       | ${''}
		${'2kCal'}            | ${'none'}  | ${''}       | ${''}
		${'-2 kCal'}          | ${'none'}  | ${''}       | ${''}
		${'1.21 Ω'}           | ${'none'}  | ${''}       | ${''}
		${'99.9%'}            | ${'none'}  | ${''}       | ${''}
		${'-.2'}              | ${'none'}  | ${''}       | ${''}
		${'1/2'}              | ${'exact'} | ${'1/2'}    | ${''}
		${'0/2'}              | ${'exact'} | ${'0/2'}    | ${''}
		${'-0/2g'}            | ${'exact'} | ${'-0/2'}   | ${'g'}
		${'6/6 g'}            | ${'exact'} | ${'6/6'}    | ${'g'}
		${'6.6/6'}            | ${'none'}  | ${''}       | ${''}
		${'9/2Miles'}         | ${'exact'} | ${'9/2'}    | ${'Miles'}
		${'-9/2 Miles'}       | ${'exact'} | ${'-9/2'}   | ${'Miles'}
		${'+33/22'}           | ${'exact'} | ${'+33/22'} | ${''}
		${'2/2kCal'}          | ${'exact'} | ${'2/2'}    | ${'kCal'}
		${'-2/2 kCal'}        | ${'exact'} | ${'-2/2'}   | ${'kCal'}
		${'1/21 Ω'}           | ${'exact'} | ${'1/21'}   | ${'Ω'}
		${'99/9%'}            | ${'exact'} | ${'99/9'}   | ${'%'}
		${'-0/0'}             | ${'exact'} | ${'-0/0'}   | ${''}
		${'6.02e23'}          | ${'none'}  | ${''}       | ${''}
		${'60.2e23'}          | ${'none'}  | ${''}       | ${''}
		${'6.02e2.3'}         | ${'none'}  | ${''}       | ${''}
		${'60.2x10^23'}       | ${'none'}  | ${''}       | ${''}
		${'6*10^23'}          | ${'none'}  | ${''}       | ${''}
		${"-6.02'23"}         | ${'none'}  | ${''}       | ${''}
		${'-6.02ee-23'}       | ${'none'}  | ${''}       | ${''}
		${'+6.02e+23 mols'}   | ${'none'}  | ${''}       | ${''}
		${'6.02x10^23 mols'}  | ${'none'}  | ${''}       | ${''}
		${'6.02*10^23 mols'}  | ${'none'}  | ${''}       | ${''}
		${"6.02'23 mols"}     | ${'none'}  | ${''}       | ${''}
		${'6.02ee23 mols'}    | ${'none'}  | ${''}       | ${''}
		${'6.02e10^23 mols'}  | ${'none'}  | ${''}       | ${''}
		${'6.02ee10^23 mols'} | ${'none'}  | ${''}       | ${''}
		${'6.02x23 mols'}     | ${'none'}  | ${''}       | ${''}
		${'6.02*23 mols'}     | ${'none'}  | ${''}       | ${''}
		${"6.02''23 mols"}    | ${'none'}  | ${''}       | ${''}
		${'6.02^23 mols'}     | ${'none'}  | ${''}       | ${''}
		${'6.02e23mols'}      | ${'none'}  | ${''}       | ${''}
		${'6.02x10^23mols'}   | ${'none'}  | ${''}       | ${''}
		${'6.02*10^23mols'}   | ${'none'}  | ${''}       | ${''}
		${"6.02'23mols"}      | ${'none'}  | ${''}       | ${''}
		${'6.02ee23mols'}     | ${'none'}  | ${''}       | ${''}
		${'6.02mols'}         | ${'none'}  | ${''}       | ${''}
		${'6.02e10^23mols'}   | ${'none'}  | ${''}       | ${''}
		${'6.02ee10^23mols'}  | ${'none'}  | ${''}       | ${''}
		${'6.02x23mols'}      | ${'none'}  | ${''}       | ${''}
		${'6.02*23mols'}      | ${'none'}  | ${''}       | ${''}
		${"6.02''23mols"}     | ${'none'}  | ${''}       | ${''}
		${'6.02^23mols'}      | ${'none'}  | ${''}       | ${''}
		${'0b0'}              | ${'none'}  | ${''}       | ${''}
		${'0b1'}              | ${'none'}  | ${''}       | ${''}
		${'0b1011'}           | ${'none'}  | ${''}       | ${''}
		${'0'}                | ${'none'}  | ${''}       | ${''}
		${'1'}                | ${'none'}  | ${''}       | ${''}
		${'1011'}             | ${'none'}  | ${''}       | ${''}
		${'0b2'}              | ${'none'}  | ${''}       | ${''}
		${'2'}                | ${'none'}  | ${''}       | ${''}
		${'0b0 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0b1 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0b1011 bytes'}     | ${'none'}  | ${''}       | ${''}
		${'0 bytes'}          | ${'none'}  | ${''}       | ${''}
		${'1 bytes'}          | ${'none'}  | ${''}       | ${''}
		${'1011 bytes'}       | ${'none'}  | ${''}       | ${''}
		${'0b2 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'2 bytes'}          | ${'none'}  | ${''}       | ${''}
		${'-0b0'}             | ${'none'}  | ${''}       | ${''}
		${'-0b1 bytes'}       | ${'none'}  | ${''}       | ${''}
		${'-0'}               | ${'none'}  | ${''}       | ${''}
		${'-01 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0b0bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0b1bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0b1011bytes'}      | ${'none'}  | ${''}       | ${''}
		${'0bytes'}           | ${'none'}  | ${''}       | ${''}
		${'1bytes'}           | ${'none'}  | ${''}       | ${''}
		${'1011bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0b2bytes'}         | ${'none'}  | ${''}       | ${''}
		${'2bytes'}           | ${'none'}  | ${''}       | ${''}
		${'-0b0'}             | ${'none'}  | ${''}       | ${''}
		${'-0b1bytes'}        | ${'none'}  | ${''}       | ${''}
		${'-0'}               | ${'none'}  | ${''}       | ${''}
		${'-01bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0o0'}              | ${'none'}  | ${''}       | ${''}
		${'0o1'}              | ${'none'}  | ${''}       | ${''}
		${'0o7'}              | ${'none'}  | ${''}       | ${''}
		${'0o8'}              | ${'none'}  | ${''}       | ${''}
		${'0o777'}            | ${'none'}  | ${''}       | ${''}
		${'0o781'}            | ${'none'}  | ${''}       | ${''}
		${'7'}                | ${'none'}  | ${''}       | ${''}
		${'8'}                | ${'none'}  | ${''}       | ${''}
		${'0o0 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0o1 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0o7 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0o8 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0o777 bytes'}      | ${'none'}  | ${''}       | ${''}
		${'0o781 bytes'}      | ${'none'}  | ${''}       | ${''}
		${'7 bytes'}          | ${'none'}  | ${''}       | ${''}
		${'8 bytes'}          | ${'none'}  | ${''}       | ${''}
		${'0o0bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0o1bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0o7bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0o8bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0o777bytes'}       | ${'none'}  | ${''}       | ${''}
		${'0o781bytes'}       | ${'none'}  | ${''}       | ${''}
		${'7bytes'}           | ${'none'}  | ${''}       | ${''}
		${'8bytes'}           | ${'none'}  | ${''}       | ${''}
		${'0x0'}              | ${'none'}  | ${''}       | ${''}
		${'0x0F'}             | ${'none'}  | ${''}       | ${''}
		${'0xfa'}             | ${'none'}  | ${''}       | ${''}
		${'-0xfa'}            | ${'none'}  | ${''}       | ${''}
		${'+0xfa'}            | ${'none'}  | ${''}       | ${''}
		${'0xG6'}             | ${'none'}  | ${''}       | ${''}
		${'#0'}               | ${'none'}  | ${''}       | ${''}
		${'#DEADBEEF'}        | ${'none'}  | ${''}       | ${''}
		${'#692B'}            | ${'none'}  | ${''}       | ${''}
		${'-#692B'}           | ${'none'}  | ${''}       | ${''}
		${'+#692B'}           | ${'none'}  | ${''}       | ${''}
		${'#ZAP'}             | ${'none'}  | ${''}       | ${''}
		${'$0'}               | ${'none'}  | ${''}       | ${''}
		${'$CCC'}             | ${'none'}  | ${''}       | ${''}
		${'$bAdFaD'}          | ${'none'}  | ${''}       | ${''}
		${'-$bAdFaD'}         | ${'none'}  | ${''}       | ${''}
		${'+$bAdFaD'}         | ${'none'}  | ${''}       | ${''}
		${'$HEX'}             | ${'none'}  | ${''}       | ${''}
		${'B'}                | ${'none'}  | ${''}       | ${''}
		${'0F'}               | ${'none'}  | ${''}       | ${''}
		${'F0'}               | ${'none'}  | ${''}       | ${''}
		${'-F0'}              | ${'none'}  | ${''}       | ${''}
		${'+F0'}              | ${'none'}  | ${''}       | ${''}
		${'999A999'}          | ${'none'}  | ${''}       | ${''}
		${'999H999'}          | ${'none'}  | ${''}       | ${''}
		${'0'}                | ${'none'}  | ${''}       | ${''}
		${'6928'}             | ${'none'}  | ${''}       | ${''}
		${'-6928'}            | ${'none'}  | ${''}       | ${''}
		${'+6928'}            | ${'none'}  | ${''}       | ${''}
		${'0x0 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'0x0F bytes'}       | ${'none'}  | ${''}       | ${''}
		${'0xfa bytes'}       | ${'none'}  | ${''}       | ${''}
		${'-0xfa bytes'}      | ${'none'}  | ${''}       | ${''}
		${'+0xfa bytes'}      | ${'none'}  | ${''}       | ${''}
		${'0xG6 bytes'}       | ${'none'}  | ${''}       | ${''}
		${'#0 bytes'}         | ${'none'}  | ${''}       | ${''}
		${'#DEADBEEF bytes'}  | ${'none'}  | ${''}       | ${''}
		${'#692B bytes'}      | ${'none'}  | ${''}       | ${''}
		${'-#692B bytes'}     | ${'none'}  | ${''}       | ${''}
		${'+#692B bytes'}     | ${'none'}  | ${''}       | ${''}
		${'#ZAP bytes'}       | ${'none'}  | ${''}       | ${''}
		${'$0 bytes'}         | ${'none'}  | ${''}       | ${''}
		${'$CCC bytes'}       | ${'none'}  | ${''}       | ${''}
		${'$bAdFaD bytes'}    | ${'none'}  | ${''}       | ${''}
		${'-$bAdFaD bytes'}   | ${'none'}  | ${''}       | ${''}
		${'+$bAdFaD bytes'}   | ${'none'}  | ${''}       | ${''}
		${'$HEX bytes'}       | ${'none'}  | ${''}       | ${''}
		${'B bytes'}          | ${'none'}  | ${''}       | ${''}
		${'0F bytes'}         | ${'none'}  | ${''}       | ${''}
		${'F0 bytes'}         | ${'none'}  | ${''}       | ${''}
		${'-F0 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'+F0 bytes'}        | ${'none'}  | ${''}       | ${''}
		${'999A999 bytes'}    | ${'none'}  | ${''}       | ${''}
		${'999H999 bytes'}    | ${'none'}  | ${''}       | ${''}
		${'0 bytes'}          | ${'none'}  | ${''}       | ${''}
		${'6928 bytes'}       | ${'none'}  | ${''}       | ${''}
		${'-6928 bytes'}      | ${'none'}  | ${''}       | ${''}
		${'+6928 bytes'}      | ${'none'}  | ${''}       | ${''}
		${'0x0bytes'}         | ${'none'}  | ${''}       | ${''}
		${'0x0Fbytes'}        | ${'none'}  | ${''}       | ${''}
		${'0xfabytes'}        | ${'none'}  | ${''}       | ${''}
		${'-0xfabytes'}       | ${'none'}  | ${''}       | ${''}
		${'+0xfabytes'}       | ${'none'}  | ${''}       | ${''}
		${'0xG6bytes'}        | ${'none'}  | ${''}       | ${''}
		${'#0bytes'}          | ${'none'}  | ${''}       | ${''}
		${'#DEADBEEFbytes'}   | ${'none'}  | ${''}       | ${''}
		${'#692Bbytes'}       | ${'none'}  | ${''}       | ${''}
		${'-#692Bbytes'}      | ${'none'}  | ${''}       | ${''}
		${'+#692Bbytes'}      | ${'none'}  | ${''}       | ${''}
		${'#ZAPbytes'}        | ${'none'}  | ${''}       | ${''}
		${'$0bytes'}          | ${'none'}  | ${''}       | ${''}
		${'$CCCbytes'}        | ${'none'}  | ${''}       | ${''}
		${'$bAdFaDbytes'}     | ${'none'}  | ${''}       | ${''}
		${'-$bAdFaDbytes'}    | ${'none'}  | ${''}       | ${''}
		${'+$bAdFaDbytes'}    | ${'none'}  | ${''}       | ${''}
		${'$HEXbytes'}        | ${'none'}  | ${''}       | ${''}
		${'Bbytes'}           | ${'none'}  | ${''}       | ${''}
		${'0Fbytes'}          | ${'none'}  | ${''}       | ${''}
		${'F0bytes'}          | ${'none'}  | ${''}       | ${''}
		${'-F0bytes'}         | ${'none'}  | ${''}       | ${''}
		${'+F0bytes'}         | ${'none'}  | ${''}       | ${''}
		${'999A999bytes'}     | ${'none'}  | ${''}       | ${''}
		${'999H999bytes'}     | ${'none'}  | ${''}       | ${''}
		${'0bytes'}           | ${'none'}  | ${''}       | ${''}
		${'6928bytes'}        | ${'none'}  | ${''}       | ${''}
		${'-6928bytes'}       | ${'none'}  | ${''}       | ${''}
		${'+6928bytes'}       | ${'none'}  | ${''}       | ${''}
	`(`parse($input)={$matchType,$valueString,$unit}`, ({ input, matchType, valueString, unit }) => {
		expect(Fractional.parse(input)).toEqual({ matchType, valueString, unit })
	})

	test('parse returns a null parse object if unit is invalid', () => {
		expect(Fractional.parse('1/2 .')).toEqual(Numeric.getNullParseObject())
	})

	test.each`
		str      | big         | isEqual
		${'1/2'} | ${0.5}      | ${true}
		${'1/2'} | ${0.49}     | ${false}
		${'1/3'} | ${0.333}    | ${false}
		${'1/3'} | ${0.3333}   | ${false}
		${'1/3'} | ${0.33333}  | ${false}
		${'1/3'} | ${0.333333} | ${true}
	`(`getIsEqual($str,$big)={$expected}`, ({ str, big, isEqual }) => {
		expect(Fractional.getIsEqual(str, Big(big))).toEqual(isEqual)
	})

	test('constructor sets terms and isReduced', () => {
		const getIsReducedSpy = jest.spyOn(Fractional, 'getIsReduced')

		const f = new Fractional('7/11')

		expect(f.terms).toEqual({
			bigNumerator: Big(7),
			bigDenominator: Big(11),
			bigValue: Big(7).div(Big(11))
		})
		expect(f.isReduced).toBe(true)
		expect(getIsReducedSpy).toHaveBeenCalledWith('7/11')

		getIsReducedSpy.mockRestore()
	})
})
