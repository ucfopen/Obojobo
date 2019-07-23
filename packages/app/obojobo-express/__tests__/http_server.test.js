import mockConsole from 'jest-mock-console';

describe('http_server', () => {
	let logger
	let mockExit
	mockVirtual('http')
	mockVirtual('https')
	let httpServer
	let insecureServer
	let secureServer
	let app
	let http
	let https
	let restoreConsole

	beforeEach(() => {
		jest.resetModules()
		restoreConsole = mockConsole('log')
		jest.mock('../logger')
		logger = oboRequire('logger')
		global.oboJestMockConfig()
		mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
		http = require('http')
		https = require('https')
		http.createServer = jest.fn()
		https.createServer = jest.fn()
		httpServer = require('../http_server')
		insecureServer = {
			on: jest.fn(),
			listen: jest.fn(),
			address: jest.fn()
		}
		secureServer = {
			on: jest.fn(),
			listen: jest.fn(),
			address: jest.fn()
		}
		http.createServer.mockReturnValue(insecureServer)
		https.createServer.mockReturnValue(secureServer)
		app = {
			set: jest.fn()
		}
	})
	afterEach(() => {
		mockExit.mockRestore()
		restoreConsole()
	})
	beforeAll(() => {})
	afterAll(() => {})

	test('startServer calls expected default methods and values', () => {
		const returnValue = httpServer(app, logger)

		expect(returnValue).toBe(insecureServer)
		expect(app.set).toHaveBeenCalledWith('port', 3000)
		expect(insecureServer.listen).toHaveBeenCalledWith(3000)
		expect(insecureServer.on).toHaveBeenCalledWith('error', expect.any(Function))
		expect(insecureServer.on).toHaveBeenCalledWith('listening', expect.any(Function))
		expect(http.createServer).toHaveBeenCalledWith({}, app)
		expect(https.createServer).not.toHaveBeenCalled()
		// eslint-disable-next-line no-console
		expect(console.log).toHaveBeenCalledWith('Note: Logging and config options can be set using environment variables.')
	})

	test('startServer starts an https server when it receives a cert', () => {
		const serverOptions = {cert: 'fake-cert', key: 'fake-key'}
		const returnValue = httpServer(app, logger, 3000, serverOptions)

		expect(returnValue).toBe(secureServer)
		expect(https.createServer).toHaveBeenCalledWith(serverOptions, app)
		expect(http.createServer).not.toHaveBeenCalled()
	})

	test('startServer converts negative ports to false', () => {
		httpServer(app, logger, -1)
		expect(app.set).toHaveBeenCalledWith('port', false)
	})

	test('startServer accepts custom ports', () => {
		http.createServer.mockReturnValue(insecureServer)
		httpServer(app, logger, 2424)

		expect(app.set).toHaveBeenCalledWith('port', 2424)
		expect(insecureServer.listen).toHaveBeenCalledWith(2424)
	})

	test('startServer handles EACCES error', () => {
		httpServer(app, logger)
		const errorCallback = insecureServer.on.mock.calls[0]
		expect(errorCallback[0]).toBe('error')

		// execute the callback
		const error = new Error()
		error.syscall = 'listen'
		error.code = 'EACCES'
		errorCallback[1](error)

		expect(logger.error).lastCalledWith('Port 3000 requires elevated privileges')
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	test('startServer EACCES error logs pipe string', () => {
		httpServer(app, logger, 'mock-pipe-string')
		const errorCallback = insecureServer.on.mock.calls[0]
		expect(errorCallback[0]).toBe('error')

		// execute the callback
		const error = new Error()
		error.syscall = 'listen'
		error.code = 'EACCES'
		errorCallback[1](error)

		expect(logger.error).lastCalledWith('Pipe mock-pipe-string requires elevated privileges')
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	test('startServer hanldes EADDRINUSE error', () => {
		httpServer(app, logger)
		const errorCallback = insecureServer.on.mock.calls[0]
		expect(errorCallback[0]).toBe('error')

		// execute the callback
		const error = new Error()
		error.syscall = 'listen'
		error.code = 'EADDRINUSE'
		errorCallback[1](error)

		expect(logger.error).lastCalledWith('Port 3000 is already in use')
		expect(mockExit).toHaveBeenCalledWith(1)
	})

	test('startServer throws on other errors', () => {
		httpServer(app, logger)
		const errorCallback = insecureServer.on.mock.calls[0]
		expect(errorCallback[0]).toBe('error')

		// execute the callback
		const error = new Error()
		error.syscall = 'listen'
		error.code = 'NOMATCH'

		expect(() => {
			errorCallback[1](error)
		}).toThrowError(error)
		expect(mockExit).not.toHaveBeenCalled()
	})

	test('startServer throws on non syscall:listen errors', () => {
		httpServer(app, logger)
		const errorCallback = insecureServer.on.mock.calls[0]
		expect(errorCallback[0]).toBe('error')

		const error = new Error()
		error.syscall = 'not-listen'
		error.code = 'NOMATCH'

		expect(() => {
			errorCallback[1](error)
		}).toThrowError(error)
		expect(mockExit).not.toHaveBeenCalled()
	})

	test('startServer on listening logs the server address', () => {
		httpServer(app, logger)
		const listeningCallBack = insecureServer.on.mock.calls[1]
		expect(listeningCallBack[0]).toBe('listening')
		insecureServer.address.mockReturnValue('mock-server-address')
		listeningCallBack[1]()
		expect(logger.info).toHaveBeenCalledWith('Listening on pipe mock-server-address')
	})

	test('startServer on listening logs the server port', () => {
		httpServer(app, logger)
		const listeningCallBack = insecureServer.on.mock.calls[1]
		expect(listeningCallBack[0]).toBe('listening')
		insecureServer.address.mockReturnValue({ port: 8888 })
		listeningCallBack[1]()
		expect(logger.info).toHaveBeenCalledWith('Listening on port 8888')
	})
})
