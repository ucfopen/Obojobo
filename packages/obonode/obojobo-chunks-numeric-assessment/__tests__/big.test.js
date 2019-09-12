import big from '../big'

describe('big.js', () => {
	test('Function returns Big object', () => {
		const b = big(0)
		expect(b.eq).toBeInstanceOf(Function)
	})

	test('Function allows "+"', () => {
		const b = big('+99.9')
		expect(b.eq).toBeInstanceOf(Function)
		expect(b.toString()).toEqual('99.9')
	})
})
