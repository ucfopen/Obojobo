jest.mock('glob')
jest.mock('../logger')

describe('Get Installed Modules', () => {
	let logger
	let glob
	let fs

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		fs = require('fs')
		glob = require('glob')
		logger = require('../logger')
		global.oboJestMockConfig()
		global.files = ''
	})

	afterAll(() => {
		delete global.files
	})

	const setupModules = excludeModules => {
		// build a mock obojobo.json config for a module
		const mockOboModule = {
			express: ['mockExpress.js'],
			modules: [
				{
					name: 'mockChunk',
					draftNode: 'mock-draft-node.js',
					viewerCSS: 'mock.css',
					viewerScript: 'mock-viewer.js'
				},
				{
					name: 'mockChunk2',
					draftNode: 'mock2-draft-node.js',
					viewerScript: 'mock2-viewer.js'
				},
				{
					name: 'mockChunk3',
					viewerCSS: 'mock3.css'
				}
			]
		}
		fs.__setMockFileContents(
			'./config/draft.json',
			'{"test":{"excludeModules":' + excludeModules + '}}'
		)
		fs.__setMockFileContents('/node_modules/mockModule/obojobo.json', JSON.stringify(mockOboModule))
		fs.__setMockFileContents('/node_modules/mockModule/mock-draft-node.js', '')
		fs.__setMockFileContents('/node_modules/mockModule/mock.css', '')
		fs.__setMockFileContents('/node_modules/mockModule/mock-viewer.js', '')

		fs.__setMockFileContents('/node_modules/mockModule/mock2-draft-node.js', '')
		fs.__setMockFileContents('/node_modules/mockModule/mock2-viewer.js', '')

		fs.__setMockFileContents('/node_modules/mockModule/mock3.css', '')

		// simulate getInstalledModules finding for obojobo.json files in modules
		glob.sync.mockReturnValueOnce(['/node_modules/mockModule/obojobo.json'])
	}

	test('getInstalledModules skips modules when not defined', () => {
		setupModules('[]')
		fs.__setMockFileContents('/node_modules/mockModule/obojobo.json', '{}')

		const getInstalledModules = require('../obo_get_installed_modules')
		const memo = getInstalledModules()

		expect(memo).toEqual({ assets: [], draftNodes: expect.any(Map), express: [] })
	})

	test('getInstalledModules runs without an error', () => {
		fs.__setMockFileContents('./config/draft.json', '{"test1":{}}')
		glob.sync.mockReturnValueOnce([])

		const getInstalledModules = require('../obo_get_installed_modules')
		const memo = getInstalledModules('test1')

		expect(memo).toEqual({ assets: [], draftNodes: expect.any(Map), express: [] })
	})

	test('getInstalledModules returns memoized values', () => {
		fs.__setMockFileContents('./config/draft.json', '{"test2":{}}')
		glob.sync.mockReturnValueOnce([])

		const getInstalledModules = require('../obo_get_installed_modules')
		const memo = getInstalledModules('test2')

		expect(memo).toEqual({ assets: [], draftNodes: expect.any(Map), express: [] })

		const memo2 = getInstalledModules('test2')

		expect(memo2).toBe(memo) // note: using === comparision
	})

	test('getInstalledModules loads obojobo.json files and builds expected results', () => {
		setupModules('[]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(4)
		expect(installedModules.assets).toContain('/node_modules/mockModule/mock-viewer.js')
		expect(installedModules.assets).toContain('/node_modules/mockModule/mock.css')
		expect(installedModules.assets).toContain('/node_modules/mockModule/mock2-viewer.js')
		expect(installedModules.draftNodes.has('mockChunk')).toBe(true)
		expect(installedModules.draftNodes.get('mockChunk')).toBe(
			'/node_modules/mockModule/mock-draft-node.js'
		)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(true)
		expect(installedModules.draftNodes.get('mockChunk2')).toBe(
			'/node_modules/mockModule/mock2-draft-node.js'
		)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(1)
		expect(installedModules.express).toContain('/node_modules/mockModule/mockExpress.js')
	})

	test('getInstalledModules throws error if file doesnt exist', () => {
		setupModules('[]')
		fs.__removeMockFileContents('/node_modules/mockModule/mock-viewer.js')

		const getInstalledModules = require('../obo_get_installed_modules')
		expect(getInstalledModules).toThrowError(
			'File Missing: "mock-viewer.js" for "mockChunk" registered in /node_modules/mockModule/obojobo.json'
		)
	})

	test('getInstalledModules does nothing if it cant determine the module name', () => {
		setupModules('[]')
		glob.sync.mockReset()
		glob.sync.mockReturnValueOnce(['/some_other_modules/mockModule/obojobo.json'])
		fs.__setMockFileContents('/some_other_modules/mockModule/obojobo.json', '{}')

		const getInstalledModules = require('../obo_get_installed_modules')
		const memo = getInstalledModules()

		expect(memo).toEqual({ assets: [], draftNodes: expect.any(Map), express: [] })
	})

	test('getInstalledModules excludes a single express script', () => {
		setupModules('["mockModule:mockExpress.js"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(4)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(0)
	})

	test('getInstalledModules excludes all express scripts', () => {
		setupModules('["*:mockExpress.js"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(4)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(0)
	})

	test('getInstalledModules doesnt exclude a non-matching express script', () => {
		setupModules('["mockModule2:mockExpress.js"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(4)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(1)
	})

	test('getInstalledModules excludes all chunks', () => {
		setupModules('["mockModule:*"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(0)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(false)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(false)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(0)
	})

	test('getInstalledModules excludes mockChunk', () => {
		setupModules('["mockModule:mockChunk"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(2)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(false)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(1)
	})

	test('getInstalledModules excludes mockChunk2', () => {
		setupModules('["mockModule:mockChunk2"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(3)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(true)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(false)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(1)
	})

	test('getInstalledModules merges module excludes', () => {
		setupModules('["mockModule:mockChunk","mockModule:mockChunk2"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(1)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(false)
		expect(installedModules.draftNodes.has('mockChunk2')).toBe(false)
		expect(installedModules.draftNodes.has('mockChunk3')).toBe(false)
		expect(installedModules.express).toHaveLength(1)
	})

	test('getInstalledModules excludes everything', () => {
		setupModules('["*:*"]')

		const getInstalledModules = require('../obo_get_installed_modules')
		const installedModules = getInstalledModules()
		expect(installedModules.assets).toHaveLength(0)
		expect(installedModules.draftNodes.has('mockChunk')).toBe(false)
		expect(installedModules.express).toHaveLength(0)
	})

	test('getInstalledModules logs included and excluded modules', () => {
		setupModules('["mockModule:mockChunk2"]')
		const getInstalledModules = require('../obo_get_installed_modules')
		getInstalledModules()

		expect(logger.info).toHaveBeenCalledWith('➕ Added mockModule:mockChunk')
		expect(logger.info).toHaveBeenCalledWith('🚫 Excluded mockModule:mockChunk2')
	})
})
