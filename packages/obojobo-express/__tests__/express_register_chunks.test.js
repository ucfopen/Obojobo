jest.mock('fs')
jest.mock('express')
jest.mock('child_process')
jest.mock('../obo_get_installed_modules')
jest.mock('../draft_node_store')

// just mock these non-existent things
mockVirtual('/file/path/express.js', () => ({expressApp:true}))

mockVirtual('webpack-dev-middleware')
mockVirtual('webpack')
mockVirtual('./webpack.config')

describe('register chunks middleware', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('calls with no errors', () => {
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		middleware(mockApp)
		expect(mockApp.get).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	it('registers all nodes as expected', () => {
		oboRequire('obo_get_installed_modules').mockImplementationOnce((env) => {
			return {
				express: [],
				assets: [],
				draftNodes: new Map([
					['pkg.type.node1', '/file/path'],
					['pkg.type.node2', '/file/other']
				])
			}
		})

		let dns = oboRequire('draft_node_store')
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		middleware(mockApp)

		expect(dns.add).toHaveBeenCalledWith('pkg.type.node1', '/file/path')
		expect(dns.add).toHaveBeenCalledWith('pkg.type.node2', '/file/other')
	})

	it('adds the webpack server in dev mode', () => {
		let webpackDevMiddleware = require('webpack-dev-middleware')
		webpackDevMiddleware.mockClear()
		webpackDevMiddleware.mockImplementationOnce(()=>{return 'webPackDevMiddleWareReturn'})

		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn().mockImplementationOnce(() => {return 'development'}),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith('webPackDevMiddleWareReturn')

		// make sure the static routes are being added in this module, they should be all via webpack
		expect(mockApp.use).not.toHaveBeenCalledWith(expect.any(String), expect.any(String))
	})

	it('adds the static paths to chunk js and css files in production mode', () => {
		let webpackDevMiddleware = require('webpack-dev-middleware')
		webpackDevMiddleware.mockClear()
		webpackDevMiddleware.mockImplementationOnce(()=>{return 'webPackDevMiddleWareReturn'})

		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn().mockImplementationOnce(() => {return 'production'}),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith('/static/viewer.min.js', expect.any(String))
		expect(mockApp.use).toHaveBeenCalledWith('/static/viewer.js', expect.any(String))
		expect(mockApp.use).toHaveBeenCalledWith('/static/viewer.min.css', expect.any(String))
		expect(mockApp.use).toHaveBeenCalledWith('/static/viewer.css', expect.any(String))

		expect(mockApp.use).not.toHaveBeenCalledWith('webPackDevMiddleWareReturn')
		expect(webpackDevMiddleware).not.toHaveBeenCalled()
	})


	it('calls express.static as expected', () => {
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)

		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.min.js')
		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.js')
		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.min.css')
		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.css')
	})

	it('adds any express applications', () => {
		oboRequire('obo_get_installed_modules').mockImplementationOnce((env) => {
			return {
				express: ['/file/path/express.js'],
				assets: [],
				draftNodes: new Map()
			}
		})
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)

		expect(mockApp.use).toHaveBeenCalledWith(require('/file/path/express.js'))

	})

})
