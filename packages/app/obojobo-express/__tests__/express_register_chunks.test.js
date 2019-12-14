/* eslint-disable no-console */
jest.mock('express')
jest.mock('../draft_node_store')
jest.mock('path')
jest.mock('obojobo-lib-utils')
jest.mock('../logger')
const realPath = require.requireActual('path')
const { getAllOboNodeScriptPathsByType } = require('obojobo-lib-utils')
const express = require('express')
mockVirtual('mock-obo-node')
mockVirtual('mock-obo-middleware')

let mockApp
// mock these non-existent things
mockVirtual('obojobo-document-engine/server/testExpress.js')
mockVirtual('obojobo-document-engine/server/otherTestExpress.js')

describe('register chunks middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		const mockedPath = require('path')
		const mockObojoboPath = realPath.resolve(__dirname, '../__mocks__/mockObojobo.js')
		mockedPath.resolve.mockReturnValueOnce(mockObojoboPath)
		mockedPath.resolve.mockImplementation(
			(dir, docDir, nodeLocation) => `test/location/${nodeLocation}`
		)
		mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals: {}
		}

		getAllOboNodeScriptPathsByType.mockReturnValue([])
	})

	afterEach(() => {})

	test('calls with no errors', () => {
		const middleware = oboRequire('express_register_chunks')

		middleware(mockApp)

		expect(mockApp.use).toHaveBeenCalledTimes(1)
	})

	test('registers all middleware as expected', () => {
		const middleware = oboRequire('express_register_chunks')
		const MockMiddleware = require('mock-obo-middleware')

		getAllOboNodeScriptPathsByType.mockReturnValueOnce(['mock-obo-middleware']) // 'mock request for middleware
		getAllOboNodeScriptPathsByType.mockReturnValueOnce([]) // mock request for obonodes
		middleware(mockApp)

		// expect middleware to require the string we send it and call dns.add with it
		expect(mockApp.use).toHaveBeenCalledWith(MockMiddleware)
	})

	test('registers all obonodes as expected', () => {
		const dns = oboRequire('draft_node_store')
		const middleware = oboRequire('express_register_chunks')
		const MockOboNode = require('mock-obo-node')

		getAllOboNodeScriptPathsByType.mockReturnValueOnce([]) // 'mock request for middleware
		getAllOboNodeScriptPathsByType.mockReturnValueOnce(['mock-obo-node']) // mock request for obonodes
		middleware(mockApp)

		// expect middleware to require the string we send it and call dns.add with it
		expect(dns.add).toHaveBeenCalledWith(MockOboNode)
	})

	test('calls express.static as expected', () => {
		const middleware = oboRequire('express_register_chunks')

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		express.static.mockReset()
		express.static.mockImplementation(path => {
			return path
		})

		middleware(mockApp)
		const compiledDir = realPath.resolve(__dirname, '..', 'public', 'compiled')

		expect(express.static).toHaveBeenCalledWith(compiledDir+'/')
	})

	test('IS_WEBPACK = true causes static directions to not be used', () => {
		const actualProcess = global.process
		global.process = {
			env: {
				IS_WEBPACK: true
			}
		}

		const middleware = oboRequire('express_register_chunks')

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		express.static.mockReset()
		express.static.mockImplementation(path => {
			return path
		})

		middleware(mockApp)

		expect(express.static).not.toHaveBeenCalled()

		global.process = actualProcess
	})
})
