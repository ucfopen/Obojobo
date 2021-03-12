jest.mock('child_process')
require('./mock-virtual')
import mockConsole from 'jest-mock-console'

let restoreConsole
const yarnList = `yarn list v1.13.0
├─ not-obojobo-chunks-thing@2.4.5
├─ obojobo-chunks-action-button@1.3.0
├─ obojobo-modules-module@9.9.9
├─ obojobo-pages-page@2.4.5
└─ obojobo-sections-content@33.33.33
✨  Done in 698.89s.`

describe('obojobo lib utils', () => {
	beforeEach(() => {
		jest.resetModules() // needed to completely reset draft_node_store
		// fake the response from yarn list
		require('child_process').execSync = jest.fn().mockReturnValue(yarnList)

		// make sure each module has an obojobo property
		mockVirtual('not-obojobo-chunks-thing')
		mockVirtual('obojobo-chunks-action-button').obojobo = {}
		mockVirtual('obojobo-modules-module').obojobo = {}
		mockVirtual('obojobo-pages-page').obojobo = {}
		mockVirtual('obojobo-sections-content').obojobo = {
			migrations: 'path-to-obojobo-sections-content-migrations'
		}
		restoreConsole = mockConsole()
	})

	afterEach(() => {
		delete process.env['OBO_DISABLE_NODES']
		restoreConsole()
	})

	test('searchNodeModulesForOboNodes attempts to load all yarn packages', () => {
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')
		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(4)
		expect(results).toMatchSnapshot()
	})

	test('searchNodeModulesForOboNodes omits modules defined in OBO_DISABLE_NODES', () => {
		process.env['OBO_DISABLE_NODES'] = 'obojobo-pages-page,obojobo-modules-module'
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')
		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(2)
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

	test('searchNodeModulesForOboNodes swollows errors when loading a non-existant module', () => {
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-module-doesnt-exist')
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')

		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(0)
	})

	test('searchNodeModulesForOboNodes logs errors when require', () => {
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-module-doesnt-exist')
		const { searchNodeModulesForOboNodes } = require('obojobo-lib-utils')

		const results = searchNodeModulesForOboNodes()
		expect(results).toHaveLength(0)
	})

	test('getOboNodeScriptPathsFromPackageByType ignores packages without obojobo property', () => {
		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
		getOboNodeScriptPathsFromPackageByType('not-obojobo-chunks-thing', 'viewer')
	})

	test('getOboNodeScriptPathsFromPackageByType uses cache when called multiple times', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			viewerScripts: '__mocks__/mock-obonode-script.js'
		}

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'viewer')
		const result2 = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'viewer')

		expect(result).toEqual(result2)
	})

	test('getOboNodeScriptPathsFromPackageByType loads viewer scripts as a string', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			viewerScripts: '__mocks__/mock-obonode-script.js'
		}

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
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

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
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

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
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

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
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

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
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

		const { getOboNodeScriptPathsFromPackageByType } = require('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackageByType('obojobo-lib-utils', 'middleware')
		expect(result).toBeNull()
	})

	test('getOboNodeScriptPathsFromPackage loads migrations scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			migrations: '__mocks__/mock-migrations'
		}

		const { getOboNodeScriptPathsFromPackage } = require('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackage('obojobo-lib-utils', 'migrations')

		expect(result).toBe('__mocks__/mock-migrations')
	})

	test('getOboNodeScriptPathsFromPackage loads parsers scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			parsers: '__mocks__/mock-parsers'
		}

		const { getOboNodeScriptPathsFromPackage } = require('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackage('obojobo-lib-utils', 'parsers')

		expect(result).toBe('__mocks__/mock-parsers')
	})

	test('getOboNodeScriptPathsFromPackage loads config scripts', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			config: '__mocks__/mock-config'
		}

		const { getOboNodeScriptPathsFromPackage } = require('obojobo-lib-utils')
		const result = getOboNodeScriptPathsFromPackage('obojobo-lib-utils', 'config')

		expect(result).toBe('__mocks__/mock-config')
	})

	test('getAllOboNodeScriptPathsByType to return a list of files', () => {
		// this test is a little weird to work around a require.resolve in the implementation
		// first lets add this current npm module to the list being loaded
		require('child_process').execSync = jest.fn().mockReturnValue('├─ obojobo-lib-utils')

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-lib-utils').obojobo = {
			expressMiddleware: '__mocks__/mock-obonode-script.js'
		}

		const { getAllOboNodeScriptPathsByType } = require('obojobo-lib-utils')
		const result = getAllOboNodeScriptPathsByType('middleware')

		expect(result).toHaveLength(1)
		expect(result[0]).toContain('obojobo-lib-utils/__mocks__/mock-obonode-script.js')
	})

	test('flattenArray handles null', () => {
		const { flattenArray } = require('obojobo-lib-utils')
		const result = flattenArray(null)
		expect(result).toBeNull()
	})

	test('flattenArray handles 2 levels of nested arrays', () => {
		const { flattenArray } = require('obojobo-lib-utils')
		const result = flattenArray([1, [2, 3]])
		expect(result).toEqual([1, 2, 3])
	})

	test('gatherClientScriptsFromModules combines clientScripts as expected', () => {
		const list = `yarn list v1.13.0
			├─ obojobo-mock-lib@
			├─ obojobo-mock-lib2@`
		const mockExecSync = jest.fn()
		mockExecSync.mockReturnValueOnce(list)
		require('child_process').execSync = mockExecSync

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-mock-lib').obojobo = {
			clientScripts: {
				extra: { file: 'lib-extra.js', position: 0 },
				repository: ['lib-repo.js', 'lib-repo2.js'], // handles arrays?
				junk: { file: 'lib-junk.js', position: 2 } // position this after the one below
			}
		}
		mockVirtual('obojobo-mock-lib2').obojobo = {
			clientScripts: {
				extra: { file: 'lib2-extra.js', position: 0 }, // handles duplicate positions
				repository: 'lib2-repo.js', // handles strings
				junk: { file: 'lib2-junk.js', position: 0 } // position above the one above
			}
		}

		const { gatherClientScriptsFromModules, setResolver } = require('obojobo-lib-utils')

		// mock require.resolve inside obojobo-lib-utils
		const mockResolver = jest.fn().mockImplementation(script => script)
		setResolver(mockResolver)

		expect(gatherClientScriptsFromModules()).toMatchInlineSnapshot(`
		Object {
		  "extra": Array [
		    "obojobo-mock-lib/lib-extra.js",
		    "obojobo-mock-lib2/lib2-extra.js",
		  ],
		  "junk": Array [
		    "obojobo-mock-lib2/lib2-junk.js",
		    "obojobo-mock-lib/lib-junk.js",
		  ],
		  "repository": Array [
		    "obojobo-mock-lib/lib-repo.js",
		    "obojobo-mock-lib/lib-repo2.js",
		    "obojobo-mock-lib2/lib2-repo.js",
		  ],
		}
	`)
	})

	test('getAllOboNodeRegistryDirsByType combines clientScripts as expected', () => {
		const list = `yarn list v1.13.0
			├─ obojobo-mock-lib@
			├─ obojobo-mock-lib1@
			├─ obojobo-mock-lib2@`
		const mockExecSync = jest.fn()
		mockExecSync.mockReturnValueOnce(list)
		require('child_process').execSync = mockExecSync

		// trick the script were testing into resolving a mock file
		mockVirtual('obojobo-mock-lib').obojobo = {
			config: 'server/config'
		}
		// lib1 has no config
		mockVirtual('obojobo-mock-lib1').obojobo = {}
		mockVirtual('obojobo-mock-lib2').obojobo = {
			config: 'server2/config/whatever'
		}

		const { getAllOboNodeRegistryDirsByType, setResolver } = require('obojobo-lib-utils')

		// mock require.resolve inside obojobo-lib-utils
		const mockResolver = jest.fn().mockImplementation(script => script)
		setResolver(mockResolver)

		expect(getAllOboNodeRegistryDirsByType('config')).toMatchInlineSnapshot(`
		Array [
		  "./server/config",
		  "./server2/config/whatever",
		]
	`)
	})
})
