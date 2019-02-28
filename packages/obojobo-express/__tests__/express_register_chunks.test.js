/* eslint-disable no-console */
jest.mock('express')
jest.mock('../draft_node_store')
jest.mock('path')
const realPath = require.requireActual('path')

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
	})
	afterEach(() => {})

	test('calls with no errors', () => {
		const middleware = oboRequire('express_register_chunks')
		const mockApp = {
			use: jest.fn()
		}

		middleware(mockApp)
		// 8 for assets, 1 each for express files
		expect(mockApp.use).toHaveBeenCalledTimes(10)
	})

	test('registers all nodes as expected', () => {
		const dns = oboRequire('draft_node_store')
		const middleware = oboRequire('express_register_chunks')
		const mockApp = {
			use: jest.fn()
		}

		middleware(mockApp)

		expect(dns.add).toHaveBeenCalledWith('otherTestName', 'test/location/otherTestLocation.js')
		expect(dns.add).toHaveBeenCalledWith('testName', 'test/location/testLocation.js')
	})

	test('calls express.static as expected', () => {
		const middleware = oboRequire('express_register_chunks')
		const mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals: {}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		const express = require('express')
		express.static.mockImplementation(path => {
			return path
		})

		middleware(mockApp)
		const compiledDir = realPath.resolve(__dirname, '..', 'public', 'compiled')

		expect(express.static).toHaveBeenCalledWith(compiledDir+'/viewer.min.js')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/viewer.js')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/viewer.min.css')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/viewer.css')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/editor.min.js')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/editor.js')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/editor.min.css')
		expect(express.static).toHaveBeenCalledWith(compiledDir+'/editor.css')
	})
})
