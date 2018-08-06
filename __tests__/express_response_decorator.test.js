const apiFunctions = ['success', 'missing', 'badInput', 'unexpected', 'reject', 'notAuthorized']
const functionsWithMessages = ['missing', 'badInput', 'unexpected', 'reject', 'notAuthorized']
let mockArgs // array of mocked express middleware request arguments

describe('api response middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockArgs = (() => {
			let mockJson = jest.fn().mockImplementation(obj => {
				return true
			})

			let mockStatus = jest.fn().mockImplementation(code => {
				return { json: mockJson }
			})

			let res = {
				json: mockJson,
				status: mockStatus,
				send: jest.fn()
			}

			let req = {
				originalUrl: '/api/mock-url-endpoint',
				is: jest.fn().mockReturnValue(true),
				accepts: jest.fn().mockReturnValue(true)
			}

			let mockNext = jest.fn()
			res.status = mockStatus

			let responseDecorator = oboRequire('express_response_decorator')
			responseDecorator(req, res, mockNext)
			return [res, req, mockJson, mockStatus, mockNext]
		})()
	})
	afterEach(() => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		mockNext.mockClear()
		mockStatus.mockClear()
		mockJson.mockClear()
	})

	test('sets the expected properties on res', () => {
		expect.assertions(apiFunctions.length * 2)
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		apiFunctions.forEach(method => {
			expect(res).toHaveProperty(method)
			expect(res[method]).toBeInstanceOf(Function)
		})
	})

	test('calls next', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		expect(mockNext).toBeCalledWith()
	})

	test('functions set status codes as expected', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		apiFunctions.forEach((method, index) => {
			res[method]()
		})
		expect(mockStatus.mock.calls).toEqual([[200], [404], [422], [500], [403], [401]])
	})

	test('success to pass the value object', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		const input = { test: true }
		const expected = { status: 'ok', value: { test: true } }

		res.success(input)
		expect(mockJson).toBeCalledWith(expected)
	})

	test('messages to be returned in the value object', () => {
		expect.assertions(functionsWithMessages.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		functionsWithMessages.forEach(method => {
			mockJson.mockReset()
			res[method]('message text')
			expect(mockJson).toBeCalled()
			expect(mockJson.mock.calls[0][0].value.message).toBe('message text')
		})
	})

	test('messages to set error status in json', () => {
		expect.assertions(functionsWithMessages.length)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		functionsWithMessages.forEach(method => {
			mockJson.mockReset()
			res[method]()
			expect(mockJson.mock.calls[0][0].status).toBe('error')
		})
	})

	test('responds with json if url starts with /api/ on all endpoints', () => {
		expect.assertions(apiFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		apiFunctions.forEach(method => {
			res.send.mockReset()
			res.json.mockReset()

			res[method]() // execute the method
			expect(res.send).not.toHaveBeenCalled()
			expect(res.json).toHaveBeenCalled()
		})
	})

	test('responds with TEXT when url is not in api and request IS NOT json', () => {
		expect.assertions(apiFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		req.originalUrl = '/mock-non-api-url-endpoint'
		req.is.mockReturnValue(false)
		req.accepts.mockReturnValue(false)

		apiFunctions.forEach(method => {
			res.send.mockReset()
			res.json.mockReset()

			res[method]() // execute the method
			expect(res.send).toHaveBeenCalled()
			expect(res.json).not.toHaveBeenCalled()
		})
	})

	test('responds with JSON when url is not in api and request IS json', () => {
		expect.assertions(apiFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		req.originalUrl = '/mock-non-api-url-endpoint'
		req.is.mockReturnValue(true)
		req.accepts.mockReturnValue(true)

		apiFunctions.forEach(method => {
			res.send.mockReset()
			res.json.mockReset()

			res[method]() // execute the method
			expect(res.send).not.toHaveBeenCalled()
			expect(res.json).toHaveBeenCalled()
		})
	})

	test('responds with JSON when url is n api and request IS NOT json', () => {
		expect.assertions(apiFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		req.originalUrl = '/api/mock-url-endpoint'
		req.is.mockReturnValue(false)
		req.accepts.mockReturnValue(false)

		apiFunctions.forEach(method => {
			res.send.mockReset()
			res.json.mockReset()

			res[method]() // execute the method
			expect(res.send).not.toHaveBeenCalled()
			expect(res.json).toHaveBeenCalled()
		})
	})

	test('success Camalizes all result json', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		const input = { top_value: { bottom_value: 'leave_me_alone' } }
		const expected = { status: 'ok', value: { topValue: { bottomValue: 'leave_me_alone' } } }

		res.success(input)
		expect(mockJson).toBeCalledWith(expected)
	})

	test('deals with error messages in unexpected', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		res.unexpected(new Error('test error'))
		expect(mockJson.mock.calls[0][0].value.message).toBe('Error: test error')
	})

	test('functions return expected values', () => {
		expect.assertions(apiFunctions.length)
		apiFunctions.forEach(method => {
			let [res, req, mockJson, mockStatus, mockNext] = mockArgs
			mockJson.mockImplementationOnce(input => {
				return 'output'
			})
			expect(res[method]('input')).toBe('output')
		})
	})
})
