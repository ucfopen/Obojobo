jest.mock('fs')
jest.mock('express')
jest.mock('child_process')

// just mock these non-existent things
jest.mock('/file/path/express.js', () => ({expressApp:true}), {virtual: true});
mockVirtual('/file/path/fake_thing.js')
mockVirtual('/file/otherpath/viewer.js')
mockVirtual('/file/otherotherpath/viewer.css')
mockVirtual('/file_2/otherpath/viewer.js')
mockVirtual('/file_2/otherotherpath/viewer.css')
mockVirtual('/file_3/path/viewer.js')

describe('register chunks middleware', () => {

	beforeAll(() => {
		let mockInstalledModules = {
			"expressApps": [
				"/file/path/express.js",
			],
			"NS.Chunks.Name": {
				"draftNode": "/file/path/fake_thing.js",
				"viewerScript": "/file/otherpath/viewer.js",
				"viewerCSS": "/file/otherotherpath/viewer.css"
			},
			"NS.Chunks.Name2": {
				"viewerScript": "/file_2/otherpath/viewer.js",
				"viewerCSS": "/file_2/otherotherpath/viewer.css"
			},
			"NS.Chunks.Name3": {
				"viewerScript": "/file_3/path/viewer.js",
			}
		}
		mockInstalledModules = JSON.stringify(mockInstalledModules)
		let fs = require('fs')
		fs.__setMockFileContents('./config/installed_modules.json', mockInstalledModules);

	})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('calls with no errors', () => {
		middleware = require('./express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}
		middleware(mockApp)
		expect(mockApp.get).toHaveBeenCalledTimes(1)
		expect(mockApp.use).toHaveBeenCalledTimes(8)
	})

	it('sets locals.modules correctly', () => {
		middleware = require('./express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}
		middleware(mockApp)
		expect(mockApp.locals).toHaveProperty('modules.viewerScript')
		expect(mockApp.locals).toHaveProperty('modules.viewerCSS')
		expect(mockApp.locals).toHaveProperty('modules.authorScript')
		expect(mockApp.locals).toHaveProperty('modules.authorCSS')

		expect(mockApp.locals.modules.viewerScript).toHaveLength(3)
		expect(mockApp.locals.modules.viewerCSS).toHaveLength(2)
		expect(mockApp.locals.modules.authorScript).toHaveLength(0)
		expect(mockApp.locals.modules.authorCSS).toHaveLength(0)

		expect(mockApp.locals.modules.viewerScript[0]).toMatchObject({
			url: '/static/modules/NS.Chunks.Name/viewerScript.js',
			path: '/file/otherpath/viewer.js',
			name: 'NS.Chunks.Name'
		})
	})

	it('adds the static paths to chunk js and css files', () => {
		middleware = require('./express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith('/static/modules/NS.Chunks.Name/viewerScript.js', '/file/otherpath/viewer.js')
		expect(mockApp.use).toHaveBeenCalledWith('/static/modules/NS.Chunks.Name/viewerCSS.css', '/file/otherotherpath/viewer.css')
		expect(mockApp.use).toHaveBeenCalledWith('/static/modules/NS.Chunks.Name2/viewerScript.js', '/file_2/otherpath/viewer.js')
		expect(mockApp.use).toHaveBeenCalledWith('/static/modules/NS.Chunks.Name2/viewerCSS.css', '/file_2/otherotherpath/viewer.css')
		expect(mockApp.use).toHaveBeenCalledWith('/static/modules/NS.Chunks.Name3/viewerScript.js', '/file_3/path/viewer.js')
	})


	it('calls express.static as expected', () => {
		middleware = require('./express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)

		expect(express.static).toHaveBeenCalledWith('/file/otherpath/viewer.js')
		expect(express.static).toHaveBeenCalledWith('/file/otherotherpath/viewer.css')
		expect(express.static).toHaveBeenCalledWith('/file_2/otherpath/viewer.js')
		expect(express.static).toHaveBeenCalledWith('/file_2/otherotherpath/viewer.css')
		expect(express.static).toHaveBeenCalledWith('/file_3/path/viewer.js')
	})


	it('registers the public path', () => {
		middleware = require('./express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)

		const publicPath = `${__dirname}/public`
		expect(express.static).toHaveBeenCalledWith(publicPath)
		expect(mockApp.use).toHaveBeenCalledWith(publicPath)
	})

	it('registers the static obojobo-draft path', () => {
		middleware = require('./express_register_chunks')
		let mockApp = {
			get: jest.fn(),
			use: jest.fn(),
			locals:{}
		}

		// mock static so it just returns it's argument for the haveBeenCalledWith tests below
		let express = require('express')
		express.static.mockImplementation((path) => { return path })

		middleware(mockApp)
		const docEngineBuildPath = `${__dirname}/node_modules/obojobo-draft-document-engine/build`
		expect(express.static).toHaveBeenCalledWith(docEngineBuildPath)
		expect(mockApp.use).toHaveBeenCalledWith('/static/obo-draft', docEngineBuildPath)

	})

	it('adds any express applications', () => {
		middleware = require('./express_register_chunks')
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
