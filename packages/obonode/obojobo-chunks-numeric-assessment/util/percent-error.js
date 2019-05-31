/**
 * Computes the percent error of Big values. `null` is returned if the true value is zero
 * (Percent error is not defined for values of zero).
 * @param {Big} measuredBigValue
 * @param {Big} trueBigValue
 * @return {number|null}
 */
export default (measuredBigValue, trueBigValue) => {
	// There is no percent error when the true value is zero:
	if (trueBigValue.eq(0)) return null

	if (measuredBigValue === null || trueBigValue === null) return null
	if (measuredBigValue.eq(trueBigValue)) return 0
	return parseFloat(
		measuredBigValue
			.minus(trueBigValue)
			.div(trueBigValue)
			.abs()
			.times(100)
	)
}
