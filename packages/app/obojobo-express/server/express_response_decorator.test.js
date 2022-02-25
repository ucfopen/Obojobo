const QueryResultError = require('pg-promise').errors.QueryResultError
const queryResultErrorCode = require('pg-promise').errors.queryResultErrorCode

const apiFunctions = ['success', 'missing', 'badInput', 'unexpected', 'reject', 'notAuthorized']
const functionsWithMessages = ['missing', 'badInput', 'unexpected', 'reject', 'notAuthorized']
const functionsWithEvents = ['missing', 'badInput', 'unexpected', 'reject', 'notAuthorized']
let mockArgs // array of mocked express middleware request arguments

jest.mock('./obo_events')

describe('api response middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockArgs = (() => {
			const mockJson = jest.fn().mockImplementation(() => {
				return true
			})

			const mockStatus = jest.fn().mockImplementation(() => {
				return { json: mockJson }
			})

			const res = {
				json: mockJson,
				status: mockStatus,
				send: jest.fn(),
				render: jest.fn()
			}

			const req = {
				originalUrl: '/api/mock-url-endpoint',
				is: jest.fn().mockReturnValue(true),
				accepts: jest.fn().mockReturnValue(true)
			}

			const mockNext = jest.fn()
			res.status = mockStatus

			const responseDecorator = oboRequire('server/express_response_decorator')
			responseDecorator(req, res, mockNext)
			return { res, req, mockJson, mockStatus, mockNext }
		})()
	})
	afterEach(() => {
		const { mockJson, mockStatus, mockNext } = mockArgs
		mockNext.mockClear()
		mockStatus.mockClear()
		mockJson.mockClear()
	})

	test('sets the expected properties on res', () => {
		expect.assertions(apiFunctions.length * 2)
		const { res } = mockArgs

		apiFunctions.forEach(method => {
			expect(res).toHaveProperty(method)
			expect(res[method]).toBeInstanceOf(Function)
		})
	})

	test('calls next', () => {
		const { mockNext } = mockArgs
		expect(mockNext).toBeCalledWith()
	})

	test('functions set status codes as expected', () => {
		const { res, mockStatus } = mockArgs

		apiFunctions.forEach(method => {
			res[method]()
		})
		expect(mockStatus.mock.calls).toEqual([[200], [404], [422], [500], [403], [401]])
	})

	test('some functions emit events', () => {
		const oboEvents = require('./obo_events')
		oboEvents.emit.mockReset()
		const { req, res } = mockArgs

		// prevent them from shorcutting due to json format
		;(req.originalUrl = 'not-an-api'), req.is.mockReturnValue(false)

		functionsWithEvents.forEach(method => {
			res[method](req, res)
		})

		expect(oboEvents.emit).toHaveBeenCalledTimes(functionsWithEvents.length)
		expect(oboEvents.emit).toHaveBeenCalledWith('HTTP_BAD_INPUT', expect.any(Object))
		expect(oboEvents.emit).toHaveBeenCalledWith('HTTP_NOT_AUTHORIZED', expect.any(Object))
		expect(oboEvents.emit).toHaveBeenCalledWith('HTTP_REJECTED', expect.any(Object))
		expect(oboEvents.emit).toHaveBeenCalledWith('HTTP_UNEXPECTED', expect.any(Object))
		expect(oboEvents.emit).toHaveBeenCalledWith('HTTP_NOT_FOUND', expect.any(Object))
	})

	test('some functions do nothing if responseHandled is set', () => {
		const { req, res } = mockArgs

		// prevent them from shorcutting due to json format
		;(req.originalUrl = 'not-an-api'), req.is.mockReturnValue(false)
		// pretend the callback marked the req w/ responseHandled
		req.responseHandled = true
		res.headersSent = false

		functionsWithEvents.forEach(method => {
			res[method](req, res)
			expect(res.send).not.toHaveBeenCalled()
		})

		req.responseHandled = false
		res.headersSent = true

		functionsWithEvents.forEach(method => {
			res[method](req, res)
			expect(res.send).not.toHaveBeenCalled()
		})
	})

	test('some functions do nothing if headers are sent', () => {
		const { res } = mockArgs

		res.headersSent = true
		functionsWithEvents.forEach(method => {
			res[method]()
			expect(res.send).not.toHaveBeenCalled()
		})
	})

	test('success to pass the value object', () => {
		const { res, mockJson } = mockArgs

		const input = { test: true }
		const expected = { status: 'ok', value: { test: true } }

		res.success(input)
		expect(mockJson).toBeCalledWith(expected)
	})

	test('messages to be returned in the value object', () => {
		expect.assertions(functionsWithMessages.length * 2)

		const { res, mockJson } = mockArgs

		functionsWithMessages.forEach(method => {
			mockJson.mockReset()
			res[method]('message text')
			expect(mockJson).toBeCalled()
			expect(mockJson.mock.calls[0][0].value.message).toBe('message text')
		})
	})

	test('messages to set error status in json', () => {
		expect.assertions(functionsWithMessages.length)

		const { res, mockJson } = mockArgs

		functionsWithMessages.forEach(method => {
			mockJson.mockReset()
			res[method]()
			expect(mockJson.mock.calls[0][0].status).toBe('error')
		})
	})

	test('responds with json if url starts with /api/ on all endpoints', () => {
		expect.assertions(apiFunctions.length * 2)

		const { res } = mockArgs

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

		const { res, req } = mockArgs
		req.originalUrl = '/mock-non-api-url-endpoint'
		req.is.mockReturnValue(false)
		req.accepts.mockReturnValue(false)

		apiFunctions.forEach(method => {
			res.send.mockReset()
			res.json.mockReset()

			res[method]() // execute the method

			// missing calls render, all others call send
			if (method === 'missing') {
				expect(res.render).toHaveBeenCalled()
			} else {
				expect(res.send).toHaveBeenCalled()
			}
			expect(res.json).not.toHaveBeenCalled()
		})
	})

	test('responds with JSON when url is not in api and request IS json', () => {
		expect.assertions(apiFunctions.length * 2)

		const { res, req } = mockArgs
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

		const { res, req } = mockArgs
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
		const { res, mockJson } = mockArgs

		const input = { top_value: { bottom_value: 'leave_me_alone' } }
		const expected = {
			status: 'ok',
			value: { topValue: { bottomValue: 'leave_me_alone' } }
		}

		res.success(input)
		expect(mockJson).toBeCalledWith(expected)
	})

	test('deals with error messages in unexpected', () => {
		const { res } = mockArgs
		res.unexpected(new Error('test error'))
		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			value: {
				type: 'unexpected',
				message: 'test error'
			}
		})
	})

	test('sanitizes error messages in unexpected for blacklisted errors', () => {
		const { res } = mockArgs

		const e = new QueryResultError(
			queryResultErrorCode.noData,
			{ rows: [] },
			'mockQuery',
			'mockValues'
		)

		expect(e.message).toBe('No data returned from the query.')

		res.unexpected(e)

		expect(res.json).toHaveBeenCalledWith({
			status: 'error',
			value: {
				type: 'unexpected',
				message: 'QueryResultError'
			}
		})
	})

	test('functions return expected values', () => {
		expect.assertions(apiFunctions.length)
		apiFunctions.forEach(method => {
			const { res, mockJson } = mockArgs
			mockJson.mockImplementationOnce(() => {
				return 'output'
			})
			expect(res[method]('input')).toBe('output')
		})
	})
})
