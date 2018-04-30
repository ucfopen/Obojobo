// array of mocked express middleware request arguments
let mockArgs = (headers = {}) => {
	let mergedHeaders = Object.assign({ host: 'im_the_host' }, headers)
	let res = {}
	let req = {
		headers: mergedHeaders,
		connection: {
			remoteAddress: '5.5.5.5',
			encrypted: false
		}
	}
	let mockJson = jest.fn().mockImplementation(obj => {
		return true
	})
	let mockStatus = jest.fn().mockImplementation(code => {
		return { json: mockJson }
	})
	let mockNext = jest.fn()
	res.status = mockStatus

	let middleware = oboRequire('express_load_balancer_helper')
	middleware(req, res, mockNext)
	return [res, req, mockJson, mockStatus, mockNext]
}

describe('load balancer helper middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('calls next', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()
		expect(mockNext).toBeCalledWith()
	})

	it('default test params are found', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()
		expect(req.connection.remoteAddress).toBe('5.5.5.5')
		expect(req.connection.encrypted).toBe(false)
		expect(req.headers.host).toBe('im_the_host')
	})

	it('remoteAddress is updated by x-forwarded-for header', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs({ 'x-forwarded-for': '1.1.1.1' })
		expect(req.connection.encrypted).toBe(false)
	})

	it('encrypted is updated by x-forwarded-proto header', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs({ 'x-forwarded-proto': 'https' })
		expect(req.connection.encrypted).toBe(true)
	})

	it('host is updated by x-host header', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs({ 'x-host': 'crazy_other_host' })
		expect(req.headers.host).toBe('crazy_other_host')
	})
})
