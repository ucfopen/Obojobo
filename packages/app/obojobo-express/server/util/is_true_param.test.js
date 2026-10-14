describe('isTrueParam', () => {
	const { isTrueParam } = require('./is_true_param')

	test.each([
		[true, true],
		['true', true],
		['True', true],
		['TRUE', true],
		['TrUE', true],
		[1, true],
		['1', true],
		[0, false],
		['0', false],
		[false, false],
		['false', false],
		['False', false],
		['FALSE', false],
		['falSE', false],
		['', false],
		[null, false],
		['null', false],
		[undefined, false], // eslint-disable-line no-undefined
		[NaN, false],
		['engaged', false]
	])('isTrueParam(%p) is %p', (param, expected) => {
		expect(isTrueParam(param)).toBe(expected)
	})
})
