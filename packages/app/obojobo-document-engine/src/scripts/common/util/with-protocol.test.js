import withProtocol from '../../../src/scripts/common/util/with-protocol'

describe('withProtocol', () => {
	test.each`
		input                    | output
		${'http://website.com'}  | ${'http://website.com'}
		${'https://website.com'} | ${'https://website.com'}
		${'//website.com'}       | ${'//website.com'}
		${'website.com'}         | ${'//website.com'}
		${'/website.com'}        | ${'///website.com'}
		${'_http://website.com'} | ${'//_http://website.com'}
	`('withProtocol("$input") = "$output"', ({ input, output }) => {
		expect(withProtocol(input)).toBe(output)
	})
})
