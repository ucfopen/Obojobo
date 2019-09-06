import getPercentError from '../../util/percent-error'
import Big from '../../big'

describe('percent-error', () => {
	test('returns expected values', () => {
		expect(getPercentError(Big(0), Big(0))).toBe(null)
		expect(getPercentError(Big(1), Big(1))).toBe(0)
		expect(getPercentError(Big(0), null)).toBe(null)
		expect(getPercentError(null, Big(1))).toBe(null)
		expect(getPercentError(Big(1.9), Big(2))).toBe(5)
	})
})
