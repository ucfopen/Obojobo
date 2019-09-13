jest.mock('../obo_express', () => {})
jest.mock('serve-favicon')
jest.mock('../config', () => {
	return {
		general: {
			bodyParser: {
				jsonOptions: 'mockJSON',
				urlencodedOptions: 'mockURL',
				textOptions: 'mockTextOptions'
			}
		}
	}
})
jest.mock('body-parser', () => {
	return {
		json: jest.fn(),
		urlencoded: jest.fn(),
		text: jest.fn()
	}
})
jest.mock('consolidate', () => mockConsolidateEngines)
jest.mock('../routes/profile', () => {})
jest.mock('../logger')
jest.mock('connect-pg-simple', () => {
	return jest.fn().mockReturnValueOnce(jest.fn())
})
jest.mock('express-session')

const originalWEBPACK = process.env.IS_WEBPACK
let mockRes
let mockError
let mockApp
let mockReq
let mockConsolidateEngines
// adds `times` number of mockImplemenationOnce calls to a mock function
const mockImplementationTimes = (mock, times, implementation) => {
	let n = times
	while (n--) {
		mock.mockImplementationOnce(implementation)
	}

	return mock
}

describe('middleware', () => {
	beforeEach(() => {
		jest.resetModules()
		delete process.env.IS_WEBPACK
		mockRes = {
			status: jest.fn(),
			render: jest.fn(),
			json: jest.fn(),
			send: jest.fn(),
			missing: jest.fn(),
			unexpected: jest.fn(),
			locals: {}
		}
		mockError = {
			message: 'mockMessage'
		}

		mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: jest.fn(),
			disable: jest.fn(),
			engines: {},
			engine: jest.fn(),
			locals: {}
		}

		mockReq = {
			path: { startsWith: jest.fn() },
			app: mockApp
		}

		mockConsolidateEngines = {}
	})
	afterAll(() => {
		process.env.IS_WEBPACK = originalWEBPACK
	})

	test('initializes with no errors', () => {
		const middleware = require('../middleware.default')

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
		expect(mockApp.disable).toHaveBeenCalledWith('x-powered-by')
	})

	test('sets default view extension to ejs', () => {
		const middleware = require('../middleware.default')
		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalledWith('view engine', 'ejs')
	})

	test('registeres ejs when not already registered', () => {
		const middleware = require('../middleware.default')
		const mockEJSEngine = {}
		mockConsolidateEngines.ejs = mockEJSEngine

		middleware(mockApp)
		expect(mockApp.engine).toHaveBeenCalledWith('ejs', mockEJSEngine)
	})

	test('skips registering ejs when already registered', () => {
		const middleware = require('../middleware.default')
		const mockEJSEngine = {}
		mockApp.engines.ejs = mockEJSEngine

		middleware(mockApp)
		expect(mockApp.engine).not.toHaveBeenCalled()
	})

	test('favicon is registered', () => {
		const middleware = require('../middleware.default')
		const favicon = require('serve-favicon')
		middleware(mockApp)
		expect(favicon).toHaveBeenCalled()
	})

	test('bodyParser is setup', () => {
		const middleware = require('../middleware.default')
		const bodyParser = require('body-parser')
		middleware(mockApp)
		expect(bodyParser.json).toHaveBeenCalled()
		expect(bodyParser.urlencoded).toHaveBeenCalled()
		expect(bodyParser.text).toHaveBeenCalled()
	})

	test('session handler is initialized', () => {
		const middleware = require('../middleware.default')
		const session = require('express-session')
		middleware(mockApp)
		expect(session).toHaveBeenCalled()
		expect(session.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "cookie": Object {
		    "httpOnly": true,
		    "maxAge": 864000000,
		    "path": "/",
		    "sameSite": false,
		    "secure": undefined,
		  },
		  "name": undefined,
		  "resave": false,
		  "rolling": true,
		  "saveUninitialized": false,
		  "secret": undefined,
		  "store": mockConstructor {},
		}
	`)
	})

	test('obo_express is registered', () => {
		const middleware = require('../middleware.default')
		const ObojoboDocumentServer = require('../obo_express')
		middleware(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith(ObojoboDocumentServer)

	})

	test('profile route is registered', () => {
		const middleware = require('../middleware.default')
		const profileRoute = require('../routes/profile')
		middleware(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith('/profile', profileRoute)
	})

	test('a 404 handler is registered', () => {
		const middleware = require('../middleware.default')
		middleware(mockApp)
		const nextToLastCallIndex = mockApp.use.mock.calls.length - 2
		const shouldBe404Handler = mockApp.use.mock.calls[nextToLastCallIndex][0]

		// is a function?
		expect(shouldBe404Handler).toBeInstanceOf(Function)

		// function has 3 args (express seems to use arg count to determine what to do)
		expect(shouldBe404Handler.length).toBe(3)
	})

	test('when using webpack, the 404 handler calls calls missing when not a static file', () => {
		process.env.IS_WEBPACK = true
		const middleware = require('../middleware.default')
		middleware(mockApp)
		const nextToLastCallIndex = mockApp.use.mock.calls.length - 2
		const shouldBe404Handler = mockApp.use.mock.calls[nextToLastCallIndex][0]
		const mockNext = jest.fn()
		// a request that isnt for a static file
		mockReq.path.startsWith.mockReturnValueOnce(false)

		shouldBe404Handler(mockReq, mockRes, mockNext)

		expect(mockRes.missing).toHaveBeenCalled()
		expect(mockNext).not.toHaveBeenCalled()
	})

	test('when using webpack, the 404 handler calls next on missing static files', () => {
		process.env.IS_WEBPACK = true
		const middleware = require('../middleware.default')
		middleware(mockApp)
		const nextToLastCallIndex = mockApp.use.mock.calls.length - 2
		const shouldBe404Handler = mockApp.use.mock.calls[nextToLastCallIndex][0]
		const mockNext = jest.fn()
		// a request that isnt for a static file
		mockReq.path.startsWith.mockReturnValueOnce(true)

		shouldBe404Handler(mockReq, mockRes, mockNext)

		expect(mockRes.missing).not.toHaveBeenCalled()
		expect(mockNext).toHaveBeenCalled()


	})

	test('when NOT using webpack, the 404 handler calls missing for non-static files', () => {
		const middleware = require('../middleware.default')
		middleware(mockApp)
		const nextToLastCallIndex = mockApp.use.mock.calls.length - 2
		const shouldBe404Handler = mockApp.use.mock.calls[nextToLastCallIndex][0]
		const mockNext = jest.fn()
		// a request that isnt for a static file
		mockReq.path.startsWith.mockReturnValueOnce(false)

		shouldBe404Handler(mockReq, mockRes, mockNext)

		expect(mockRes.missing).toHaveBeenCalled()
		expect(mockNext).not.toHaveBeenCalled()
	})

	test('when NOT using webpack, the 404 handler calls missing for static files', () => {
		const middleware = require('../middleware.default')
		middleware(mockApp)
		const nextToLastCallIndex = mockApp.use.mock.calls.length - 2
		const shouldBe404Handler = mockApp.use.mock.calls[nextToLastCallIndex][0]
		const mockNext = jest.fn()
		// a request that isnt for a static file
		mockReq.path.startsWith.mockReturnValueOnce(true)

		shouldBe404Handler(mockReq, mockRes, mockNext)

		expect(mockRes.missing).toHaveBeenCalled()
		expect(mockNext).not.toHaveBeenCalled()
	})

	test('an error handler is registered last', () => {
		const middleware = require('../middleware.default')
		middleware(mockApp)
		const lastCallIndex = mockApp.use.mock.calls.length - 1
		const shouldBeErrorHandler = mockApp.use.mock.calls[lastCallIndex][0]

		// is a function?
		expect(shouldBeErrorHandler).toBeInstanceOf(Function)

		// function has 4 args
		expect(shouldBeErrorHandler.length).toBe(4)
	})

	test('an error handler is registered last', () => {
		const logger = require('../logger')
		const middleware = require('../middleware.default')
		const mockNext = jest.fn()
		middleware(mockApp)
		const lastCallIndex = mockApp.use.mock.calls.length - 1
		const shouldBeErrorHandler = mockApp.use.mock.calls[lastCallIndex][0]

		// is a function?
		shouldBeErrorHandler('mock-error', mockReq, mockRes, mockNext)

		expect(mockRes.unexpected).toHaveBeenCalled()
		expect(logger.error).toHaveBeenCalled()
	})

})
