import Fractional from '../fractional.js'
import Big from 'big.js'
import getPercentError from '../percent-error.js'
import { fractionalRegex } from '../input-regexes.js'

jest.mock('../input-regexes.js', () => {
	return {
		fractionalRegex: {
			test: jest.fn()
		}
	}
})

jest.mock('../percent-error.js')

describe('Fractional', () => {
	test('get type returns expected type', () => {
		expect(Fractional.type).toEqual('fractional')
	})

	test('getMatchType returns the correct match type', () => {
		fractionalRegex.test.mockReturnValue(false)
		expect(Fractional.getMatchType()).toBe('none')

		fractionalRegex.test.mockReturnValue(true)
		expect(Fractional.getMatchType()).toBe('exact')
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

	test('getGCD', () => {
		expect(Fractional.getGCD(Big(2), Big(-4))).toEqual(Big(2))
		expect(Fractional.getGCD(Big(2), Big(8))).toEqual(Big(2))
		expect(Fractional.getGCD(Big(-4), Big(-8))).toEqual(Big(4))
		expect(Fractional.getGCD(Big(27), Big(9))).toEqual(Big(9))
		expect(Fractional.getGCD(Big(-7), Big(11))).toEqual(Big(1))
		expect(Fractional.getGCD(Big(999), Big(0))).toEqual(Big(999))
		expect(Fractional.getGCD(Big(-168), Big(-1617))).toEqual(Big(21))
		expect(Fractional.getGCD(Big(100), Big(80))).toEqual(Big(20))
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

	test('getString returns an approximate reduced fractional string of a Big object', () => {
		//@TODO - Allow customizable error amounts?
		expect(Fractional.getString(Big(2))).toBe('2/1')
		expect(Fractional.getString(Big(-1))).toBe('-1/1')
		expect(Fractional.getString(Big(0.5))).toBe('1/2')
		expect(Fractional.getString(Big(0.4))).toBe('2/5')
		expect(Fractional.getString(Big(-0.25))).toBe('-1/4')
		expect(Fractional.getString(Big(0.125))).toBe('1/8')
		expect(Fractional.getString(Big(3.14))).toBe('157/50')
		expect(Fractional.getString(Big(0))).toBe('0/1')
		expect(Fractional.getString(Big(1))).toBe('1/1')
		expect(Fractional.getString(Big(0.333333))).toBe('1/3')
		expect(Fractional.getString(Big(0.666666))).toBe('2/3')
		expect(Fractional.getString(Big(0.666667))).toBe('2/3')
		expect(Fractional.getString(Big(0.33333))).toBe('25641/76924')
		expect(Fractional.getString(Big(0.66666))).toBe('28987/43481')
		expect(Fractional.getString(Big(0.166666))).toBe('1/6')
		expect(Fractional.getString(Big(0.111))).toBe('111/1000')
		expect(Fractional.getString(Big(0.1))).toBe('1/10')
		expect(Fractional.getString(Big(0.01))).toBe('1/100')
		expect(Fractional.getString(Big(0.001))).toBe('1/1000')
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

	test('getBigValueFractionTerms converts a big value to fractional terms', () => {
		const f = Fractional.getBigValueFractionTerms
		expect(f(Big(2))).toEqual({ bigNumerator: Big(2), bigDenominator: Big(1) })
		expect(f(Big(-1))).toEqual({ bigNumerator: Big(-1), bigDenominator: Big(1) })
		expect(f(Big(0.5))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(2) })
		expect(f(Big(0.4))).toEqual({ bigNumerator: Big(2), bigDenominator: Big(5) })
		expect(f(Big(-0.25))).toEqual({ bigNumerator: Big(-1), bigDenominator: Big(4) })
		expect(f(Big(0.125))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(8) })
		expect(f(Big(3.14))).toEqual({ bigNumerator: Big(157), bigDenominator: Big(50) })
		expect(f(Big(0))).toEqual({ bigNumerator: Big(0), bigDenominator: Big(1) })
		expect(f(Big(1))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(1) })
		expect(f(Big(0.333333))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(3) })
		expect(f(Big(0.666666))).toEqual({ bigNumerator: Big(2), bigDenominator: Big(3) })
		expect(f(Big(0.666667))).toEqual({ bigNumerator: Big(2), bigDenominator: Big(3) })
		expect(f(Big(0.33333))).toEqual({ bigNumerator: Big(25641), bigDenominator: Big(76924) })
		expect(f(Big(0.66666))).toEqual({ bigNumerator: Big(28987), bigDenominator: Big(43481) })
		expect(f(Big(0.111))).toEqual({ bigNumerator: Big(111), bigDenominator: Big(1000) })
		expect(f(Big(0.1))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(10) })
		expect(f(Big(0.01))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(100) })
		expect(f(Big(0.001))).toEqual({ bigNumerator: Big(1), bigDenominator: Big(1000) })
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
