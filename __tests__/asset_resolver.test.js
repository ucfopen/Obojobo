const env_node = process.env.NODE_ENV
delete process.env.NODE_ENV
let AssetResolver = require('../asset_resolver')

describe('Asset Resolver', () => {
	afterAll(() => {
		process.env.NODE_ENV = env_node
	})
	test('assetForEnv builds pattern for dev server', () => {
		let path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for dev server with nickname', () => {
		let path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'dev')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for test server', () => {
		let path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'test')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for production server', () => {
		let path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'production')

		expect(path).toEqual('mock/path/item.min.js')
	})

	test('assetForEnv builds pattern for production server with nickname', () => {
		let path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'prod')

		expect(path).toEqual('mock/path/item.min.js')
	})
})
