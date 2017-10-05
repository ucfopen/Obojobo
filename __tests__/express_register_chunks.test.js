jest.mock('fs')
jest.mock('express')
jest.mock('child_process')
jest.mock('../obo_get_installed_modules')
jest.mock('../draft_node_store')

// just mock these non-existent things
mockVirtual('/file/path/express.js', () => ({ expressApp: true }))

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
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.get).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	it('registers all nodes as expected', () => {
		oboRequire('obo_get_installed_modules').mockImplementationOnce(env => {
			return {
				express: [],
				assets: [],
				draftNodes: new Map([['pkg.type.node1', '/file/path'], ['pkg.type.node2', '/file/other']])
			}
		})

		let dns = oboRequire('draft_node_store')
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals: {}
		}

		middleware(mockApp)

		expect(dns.add).toHaveBeenCalledWith('pkg.type.node1', '/file/path')
		expect(dns.add).toHaveBeenCalledWith('pkg.type.node2', '/file/other')
	})

	it('calls express.static as expected', () => {
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals: {}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation(path => {
			return path
		})

		middleware(mockApp)

		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.min.js')
		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.js')
		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.min.css')
		expect(express.static).toHaveBeenCalledWith('./public/compiled/viewer.css')
	})

	it('adds any express applications', () => {
		oboRequire('obo_get_installed_modules').mockImplementationOnce(env => {
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
			locals: {}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation(path => {
			return path
		})

		middleware(mockApp)

		expect(mockApp.use).toHaveBeenCalledWith(require('/file/path/express.js'))
	})
})
