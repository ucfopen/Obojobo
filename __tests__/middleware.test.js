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
jest.mock('../routes/profile', () => {})
jest.mock('../routes/index', () => {})
jest.mock('../logger')
jest.mock('connect-pg-simple', () => {
	return jest.fn().mockReturnValueOnce(jest.fn())
})
jest.mock('express-session')

const originalWEBPACK = process.env.IS_WEBPACK
let mockRes
let mockError

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
	})
	afterAll(() => {
		process.env.IS_WEBPACK = originalWEBPACK
	})

	test('calls with no errors', () => {
		const middleware = require('../middleware.default')
		let req = {
			path: {
				startsWith: jest.fn()
			},
			accepts: jest.fn().mockReturnValueOnce(true),
			app: {
				get: jest.fn().mockReturnValueOnce('production')
			}
		}

		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: mockImplementationTimes(jest.fn(), 10, () => {})
				.mockImplementationOnce(funct => {
					funct(req, mockRes, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(mockError, req, mockRes, jest.fn())
				}),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	test('calls with html allowed', () => {
		const middleware = require('../middleware.default')
		let req = {
			path: {
				startsWith: jest.fn()
			},
			accepts: jest.fn().mockReturnValueOnce(true), // allows Html in 404
			app: {
				get: jest.fn().mockReturnValueOnce('development')
			}
		}

		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: mockImplementationTimes(jest.fn(), 10, () => {})
				.mockImplementationOnce(funct => {
					funct(req, mockRes, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(mockError, req, mockRes, jest.fn())
				}),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	test('calls with json allowed', () => {
		const middleware = require('../middleware.default')
		let req = {
			path: {
				startsWith: jest.fn()
			},
			accepts: jest
				.fn()
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(true), // allows JSON in 404 error
			app: {
				get: jest.fn().mockReturnValueOnce('development')
			}
		}

		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: mockImplementationTimes(jest.fn(), 10, () => {})
				.mockImplementationOnce(funct => {
					funct(req, mockRes, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(mockError, req, mockRes, jest.fn())
				}),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	test('calls with WEBPACK', () => {
		process.env.IS_WEBPACK = true
		const middleware = require('../middleware.default')
		let req = {
			path: {
				startsWith: jest.fn()
			},
			accepts: jest.fn(),
			app: {
				get: jest.fn().mockReturnValueOnce('development')
			}
		}

		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: mockImplementationTimes(jest.fn(), 10, () => {})
				.mockImplementationOnce(funct => {
					funct(req, mockRes, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(mockError, req, mockRes, jest.fn())
				}),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	test('calls with WEBPACK and falls to /static/', () => {
		process.env.IS_WEBPACK = true
		const middleware = require('../middleware.default')
		let req = {
			path: {
				startsWith: jest.fn().mockReturnValueOnce(true)
			},
			accepts: jest.fn(),
			app: {
				get: jest.fn().mockReturnValueOnce('development')
			}
		}

		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: mockImplementationTimes(jest.fn(), 10, () => {})
				.mockImplementationOnce(funct => {
					funct(req, mockRes, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(mockError, req, mockRes, jest.fn())
				}),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})
})
