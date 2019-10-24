// array of mocked express middleware request arguments
const mockArgs = (headers = {}) => {
	const mergedHeaders = Object.assign({ host: 'im_the_host' }, headers)
	const res = {}
	const req = {
		headers: mergedHeaders,
		connection: {
			remoteAddress: '5.5.5.5',
			encrypted: false
		}
	}
	const mockJson = jest.fn().mockImplementation(() => {
		return true
	})
	const mockStatus = jest.fn().mockImplementation(() => {
		return { json: mockJson }
	})
	const mockNext = jest.fn()
	res.status = mockStatus

	const middleware = oboRequire('express_load_balancer_helper')
	middleware(req, res, mockNext)
	return { res, req, mockJson, mockStatus, mockNext }
}

describe('load balancer helper middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('calls next', () => {
		const { mockNext } = mockArgs()
		expect(mockNext).toBeCalledWith()
	})

	test('default test params are found', () => {
		const { req } = mockArgs()
		expect(req.connection.remoteAddress).toBe('5.5.5.5')
		expect(req.connection.encrypted).toBe(false)
		expect(req.headers.host).toBe('im_the_host')
	})

	test('remoteAddress is updated by x-forwarded-for header', () => {
		const { req } = mockArgs({ 'x-forwarded-for': '1.1.1.1' })
		expect(req.connection.encrypted).toBe(false)
	})

	test('encrypted is updated by x-forwarded-proto header', () => {
		const { req } = mockArgs({ 'x-forwarded-proto': 'https' })
		expect(req.connection.encrypted).toBe(true)
	})

	test('host is updated by X-Forwarded-Host header', () => {
		const { req } = mockArgs({ 'x-forwarded-host': 'crazy_other_host' })
		expect(req.headers.host).toBe('crazy_other_host')
	})
})
