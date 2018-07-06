import getInstalledModules from '../obo_get_installed_modules'
import fs from 'fs'
import glob from 'glob'
import json from '../config/draft.json'
import logger from '../logger'

jest.mock('glob')
jest.mock('fs')
jest.mock('../logger')

describe('Get Installed Modules', () => {
	beforeAll(() => {
		fs.readFileSync = jest.fn()
		fs.existsSync = jest.fn()
	})
	beforeEach(() => {
		global.files = ''
		jest.resetAllMocks()
	})

	afterAll(() => {
		delete global.files
	})

	test('getInstalledModules runs without an error', () => {
		fs.readFileSync.mockReturnValueOnce('{"test1":{}}')
		glob.sync.mockReturnValueOnce([])

		let memo = getInstalledModules('test1')

		expect(memo).toEqual({ assets: [], draftNodes: expect.any(Map), express: [] })
	})

	test('getInstalledModules returns memoized values', () => {
		fs.readFileSync.mockReturnValueOnce('{"test2":{}}')
		glob.sync.mockReturnValueOnce([])

		let memo = getInstalledModules('test2')

		expect(memo).toEqual({ assets: [], draftNodes: expect.any(Map), express: [] })

		let memo2 = getInstalledModules('test2')

		expect(memo2).toBe(memo)
	})

	test('getInstalledModules runs with files', () => {
		fs.readFileSync.mockReturnValueOnce(
			'{"production":{"excludeModules": ["*:mockExclude", "*:mockAlsoExclude", "mockModule:mockExclude"]}}'
		)
		glob.sync.mockReturnValueOnce([
			'/node_modules/mockModule/mockFile.js',
			'/node_modules/mockModule/mockFile.jpg'
		])
		fs.readFileSync.mockReturnValueOnce(`{
			"express": ["mockExpress"],
			"modules": [{"name":"mockExclude"}, {"name":"mockIncluded"}]
		}`) // file data for mockFile.js
		fs.readFileSync.mockReturnValueOnce('{}') // file data for mockFile.jpg

		let memo = getInstalledModules()

		expect(memo).toEqual({
			assets: [],
			draftNodes: expect.any(Map),
			express: ['/node_modules/mockModule/mockExpress']
		})
		expect(logger.info).toHaveBeenCalledWith('➕ Added mockModule:mockIncluded')
		expect(logger.info).toHaveBeenCalledWith('🚫 Excluded mockModule:mockExclude')
	})

	test('getInstalledModules runs with files and adds assets', () => {
		fs.readFileSync.mockReturnValueOnce('{"test3":{}}')
		glob.sync.mockReturnValueOnce([
			'/node_modules/mockModule/mockFile.js',
			'/node_modules/mockModule/mockFile.jpg'
		])
		fs.readFileSync.mockReturnValueOnce(`{
			"express": ["mockExpress"],
			"modules": [{
				"name":"mockIncluded",
				"viewerScript":"mockViewer.js",
				"viewerCSS":"mockViewer.scss",
				"draftNode":"mockNode.js"
			}]
		}`) // file data for mockFile.js
		fs.existsSync.mockReturnValueOnce(true) // viewerScript file exists
		fs.existsSync.mockReturnValueOnce(true) // viewerCSS file exists
		fs.existsSync.mockReturnValueOnce(true) // draftNode file exists
		fs.readFileSync.mockReturnValueOnce('{}') // file data for mockFile.jpg

		let memo = getInstalledModules('test3')

		expect(memo).toEqual({
			assets: [
				'/node_modules/mockModule/mockViewer.js',
				'/node_modules/mockModule/mockViewer.scss'
			],
			draftNodes: expect.any(Map),
			express: ['/node_modules/mockModule/mockExpress']
		})
		expect(logger.info).toHaveBeenCalledWith('➕ Added mockModule:mockIncluded')
	})

	test('getInstalledModules throws an error if a fle is missing', () => {
		fs.readFileSync.mockReturnValueOnce('{"test4":{}}')
		glob.sync.mockReturnValueOnce(['mockFile.js', '/node_modules/mockModule/mockFile.jpg'])
		fs.readFileSync.mockReturnValueOnce(`{
			"express": ["mockExpress"],
			"modules": [{
				"name":"mockIncluded",
				"viewerScript":"mockViewer.js",
				"viewerCSS":"mockViewer.scss",
				"draftNode":"mockNode.js"
			}]
		}`) // file data for mockFile.js
		fs.existsSync.mockReturnValueOnce(false) // viewerScript file does not exist

		expect(() => {
			getInstalledModules('test4')
		}).toThrowError('File Missing: "mockViewer.js" for "mockIncluded" registered in ./obojobo.json')
	})
})
