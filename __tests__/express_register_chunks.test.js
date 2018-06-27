jest.mock('fs')
jest.mock('express')
jest.mock('child_process')
jest.mock('../obo_get_installed_modules')
jest.mock('extract-text-webpack-plugin')
jest.mock('../draft_node_store')

// just mock these non-existent things
mockVirtual('/file/path/express.js', () => ({ expressApp: true }))

// Prevent webpack from printing to console
const originalLog = console.log
console.log = jest.fn()
const webpack = require('../webpack.config.js')
console.log = originalLog

describe('register chunks middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('calls with no errors', () => {
		let middleware = oboRequire('express_register_chunks')
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			use: jest.fn(),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.get).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})

	test('registers all nodes as expected', () => {
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

	test('calls express.static as expected', () => {
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

	test('adds any express applications', () => {
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
