// mock a fake webpack manifest
jest.mock(
	'../public/compiled/manifest.json',
	() => ({
		'test.js': '/static-from-manifest/test.js',
		'test.css': '/static-from-manifest/test.css',
		'subdir/test.json': '/static-from-manifest/subdir/test.json'
	}),
	{ virtual: true }
)

const { assetForEnv } = require('../server/asset_resolver')

describe('Asset Resolver', () => {
	const originalNODE_ENV = process.env.NODE_ENV
	const originalIS_WEBPACK = process.env.IS_WEBPACK

	afterAll(() => {
		process.env.NODE_ENV = originalNODE_ENV
		process.env.IS_WEBPACK = originalIS_WEBPACK
	})

	beforeEach(() => {
		jest.resetModules()
		delete process.env.NODE_ENV
		delete process.env.ASSET_ENV
		delete process.env.IS_WEBPACK
	})

	test('assetForEnv builds pattern for dev server', () => {
		const path = assetForEnv('mock/path/item$[.full|.min].js')
		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for dev server with nickname', () => {
		const path = assetForEnv('mock/path/item$[.full|.min].js', 'dev')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for test server', () => {
		const path = assetForEnv('mock/path/item$[.full|.min].js', 'test')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for production server', () => {
		const path = assetForEnv('mock/path/item$[.full|.min].js', 'production')

		expect(path).toEqual('mock/path/item.min.js')
	})

	test('assetForEnv builds pattern for production server with nickname', () => {
		const path = assetForEnv('mock/path/item$[.full|.min].js', 'prod')

		expect(path).toEqual('mock/path/item.min.js')
	})

	test('assertForEnv responds to process.env.ASSET_ENV', () => {
		const beforeSet = assetForEnv('mock/path/item$[.full|.min].js')
		expect(beforeSet).toEqual('mock/path/item.full.js')

		process.env.ASSET_ENV = 'prod'

		const afterSet = assetForEnv('mock/path/item$[.full|.min].js')
		expect(afterSet).toEqual('mock/path/item.min.js')

		const afterSetWithForce = assetForEnv('mock/path/item$[.full|.min].js', 'dev')
		expect(afterSetWithForce).toEqual('mock/path/item.full.js')
	})

	test('webpackAssetPath returns expected paths when using webpack dev server', () => {
		process.env.IS_WEBPACK = 'true'
		const { webpackAssetPath } = require('../server/asset_resolver')

		expect(webpackAssetPath('test.js')).toBe('/static/test.js')
		expect(webpackAssetPath('test.css')).toBe('/static/test.css')
		expect(webpackAssetPath('subdir/test.json')).toBe('/static/subdir/test.json')
		expect(webpackAssetPath('asset-that-doesnt-exist.js')).toBe(
			'/static/asset-that-doesnt-exist.js'
		)
	})

	test('webpackAssetPath returns expected paths when NOT using webpack dev server', () => {
		process.env.IS_WEBPACK = 'false'
		const { webpackAssetPath } = require('../server/asset_resolver')

		expect(webpackAssetPath('test.js')).toBe('/static-from-manifest/test.js')
		expect(webpackAssetPath('test.css')).toBe('/static-from-manifest/test.css')
		expect(webpackAssetPath('subdir/test.json')).toBe('/static-from-manifest/subdir/test.json')
		expect(webpackAssetPath('asset-that-doesnt-exist.js')).toBe(undefined) //eslint-disable-line no-undefined
	})
})
