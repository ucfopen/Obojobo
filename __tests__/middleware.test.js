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

describe('middleware', () => {
	beforeEach(() => {
		jest.resetModules()
		delete process.env.IS_WEBPACK
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
		let res = {
			status: jest.fn(),
			render: jest.fn(),
			json: jest.fn(),
			send: jest.fn(),
			locals: {}
		}
		let error = {
			message: 'mockMessage'
		}
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: jest
				.fn()
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {}) // 10 uses before 404 handler
				.mockImplementationOnce(funct => {
					funct(req, res, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(error, req, res, jest.fn())
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
		let res = {
			status: jest.fn(),
			render: jest.fn(),
			json: jest.fn(),
			send: jest.fn(),
			locals: {}
		}
		let error = {
			message: 'mockMessage'
		}
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: jest
				.fn()
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {}) // 10 uses before 404 handler
				.mockImplementationOnce(funct => {
					funct(req, res, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(error, req, res, jest.fn())
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
		let res = {
			status: jest.fn(),
			render: jest.fn(),
			json: jest.fn(),
			send: jest.fn(),
			locals: {}
		}
		let error = {
			message: 'mockMessage'
		}
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: jest
				.fn()
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {}) // 10 uses before 404 handler
				.mockImplementationOnce(funct => {
					funct(req, res, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(error, req, res, jest.fn())
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
		let res = {
			status: jest.fn(),
			render: jest.fn(),
			json: jest.fn(),
			send: jest.fn(),
			locals: {}
		}
		let error = {
			message: 'mockMessage'
		}
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: jest
				.fn()
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {}) // 10 uses before 404 handler
				.mockImplementationOnce(funct => {
					funct(req, res, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(error, req, res, jest.fn())
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
		let res = {
			status: jest.fn(),
			render: jest.fn(),
			json: jest.fn(),
			send: jest.fn(),
			locals: {}
		}
		let error = {
			message: 'mockMessage'
		}
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			set: jest.fn(),
			use: jest
				.fn()
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {})
				.mockImplementationOnce(() => {}) // 10 uses before 404 handler
				.mockImplementationOnce(funct => {
					funct(req, res, jest.fn())
				})
				.mockImplementationOnce(funct => {
					funct(error, req, res, jest.fn())
				}),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.set).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})
})
