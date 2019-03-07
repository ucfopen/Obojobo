jest.mock('child_process')

require('./mock-virtual')

const yarnList = `yarn list v1.13.0
├─ not-obojobo-chunks-thing@2.4.5
├─ obojobo-chunks-action-button@1.3.0
├─ obojobo-modules-module@9.9.9
├─ obojobo-pages-page@2.4.5
└─ obojobo-sections-content@33.33.33
✨  Done in 698.89s.`

describe('obojobo lib utils', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetModules() // needed to completely reset draft_node_store
		// fake the response from yarn list
		require('child_process').execSync = jest.fn().mockReturnValue(yarnList)

		// make sure each module has an obojobo property
		mockVirtual('not-obojobo-chunks-thing')
		mockVirtual('obojobo-chunks-action-button').obojobo = {}
		mockVirtual('obojobo-modules-module').obojobo = {}
		mockVirtual('obojobo-pages-page').obojobo = {}
		mockVirtual('obojobo-sections-content').obojobo = {}
	})
	afterEach(() => {})

	test('searchNodeModulesForOboNodes attempts to load all yarn packages', () => {
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')
		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(4)
		expect(results).toMatchSnapshot()
	})

	test('searchNodeModulesForOboNodes omits modules with no obojobo export', () => {
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')
		delete require('obojobo-chunks-action-button').obojobo
		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(3)
		expect(results).not.toContain('obojobo-chunks-action-button')
	})

	test('searchNodeModulesForOboNodes quickly returns when called twice', () => {
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')
		const execSync = require('child_process').execSync

		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(4)
		expect(execSync).toHaveBeenCalledTimes(1)

		// call again, this time execSync should not be called again
		const results2 = searchNodeModulesForOboNodes()
		expect(results2).toHaveLength(4)
		expect(execSync).toHaveBeenCalledTimes(1)
	})

	test('searchNodeModulesForOboNodes reloads with forceReload', () => {
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')
		const execSync = require('child_process').execSync

		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(4)
		expect(execSync).toHaveBeenCalledTimes(1)

		// call again, this time execSync should be called again
		const results2 = searchNodeModulesForOboNodes(true)
		expect(results2).toHaveLength(4)
		expect(execSync).toHaveBeenCalledTimes(2)
	})

	test('searchNodeModulesForOboNodes swollows errors trying to load a non-existant module', () => {
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-module-doesnt-exist')
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')

		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(0)
	})

	test('getOboNodeScriptPathsFromPackageByType ignores packages without obojobo property', () => {
		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
		getOboNodeScriptPathsFromPackageByType('not-obojobo-chunks-thing', 'viewer')
	})

	test('getOboNodeScriptPathsFromPackageByType loads viewer scripts as a string', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			viewerScripts: '__mocks__/mock-obonode-script.js'
		}

		// now process the viewe scripts
		const { getOboNodeScriptPathsFromPackageByType } = jest.requireActual('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'viewer')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('getOboNodeScriptPathsFromPackageByType loads viewer scripts as an array', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			viewerScripts: ['__mocks__/mock-obonode-script.js']
		}

		// now process the viewe scripts
		const { getOboNodeScriptPathsFromPackageByType } = jest.requireActual('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'viewer')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('getOboNodeScriptPathsFromPackageByType loads editor scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			editorScripts: '__mocks__/mock-obonode-script.js'
		}

		// now process the viewe scripts
		const { getOboNodeScriptPathsFromPackageByType } = jest.requireActual('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'editor')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('getOboNodeScriptPathsFromPackageByType loads obonodes scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			serverScripts: '__mocks__/mock-obonode-script.js'
		}

		// now process the viewe scripts
		const { getOboNodeScriptPathsFromPackageByType } = jest.requireActual('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'obonodes')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('getOboNodeScriptPathsFromPackageByType loads middleware scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			expressMiddleware: '__mocks__/mock-obonode-script.js'
		}

		// now process the viewe scripts
		const { getOboNodeScriptPathsFromPackageByType } = jest.requireActual('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'middleware')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('getOboNodeScriptPathsFromPackageByType ignores missing scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			expressMiddleware: null
		}

		// now process the viewe scripts
		const { getOboNodeScriptPathsFromPackageByType } = jest.requireActual('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'middleware')
		expect(result).toBeNull()
	})

	test('getAllOboNodeScriptPathsByType to return a list of files', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			expressMiddleware: '__mocks__/mock-obonode-script.js'
		}

		// now process the viewe scripts
		const { getAllOboNodeScriptPathsByType } = jest.requireActual('obojobo-lib-utils')
		const result = getAllOboNodeScriptPathsByType('middleware')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('flattenArray handles null', () => {
		const { flattenArray } = jest.requireActual('obojobo-lib-utils')
		const result = flattenArray(null)
		expect(result).toBeNull()
	})

	test('flattenArray handles 2 levels of nested arrays', () => {
		const { flattenArray } = jest.requireActual('obojobo-lib-utils')
		const result = flattenArray([1, [2, 3]])
		expect(result).toEqual([1, 2, 3])
	})
})
