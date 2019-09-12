import getPercentError from '../../util/percent-error'
import big from '../../big'

describe('percent-error', () => {
	test('returns expected values', () => {
		expect(getPercentError(big(0), big(0))).toBe(null)
		expect(getPercentError(big(1), big(1))).toBe(0)
		expect(getPercentError(big(0), null)).toBe(null)
		expect(getPercentError(null, big(1))).toBe(null)
		expect(getPercentError(big(1.9), big(2))).toBe(5)
	})
})
