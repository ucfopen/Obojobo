describe('Asset Resolver', () => {
	const originalNODE_ENV = process.env.NODE_ENV
	let AssetResolver

	afterAll(() => {
		process.env.NODE_ENV = originalNODE_ENV
	})

	beforeEach(() => {
		jest.resetModules()
		delete process.env.NODE_ENV
		delete process.env.ASSET_ENV
		AssetResolver = require('../asset_resolver')
	})

	test('assetForEnv builds pattern for dev server', () => {
		const path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for dev server with nickname', () => {
		const path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'dev')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for test server', () => {
		const path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'test')

		expect(path).toEqual('mock/path/item.full.js')
	})

	test('assetForEnv builds pattern for production server', () => {
		const path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'production')

		expect(path).toEqual('mock/path/item.min.js')
	})

	test('assetForEnv builds pattern for production server with nickname', () => {
		const path = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'prod')

		expect(path).toEqual('mock/path/item.min.js')
	})

	test('assertForEnv responds to process.env.ASSET_ENV', () => {
		const beforeSet = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js')
		expect(beforeSet).toEqual('mock/path/item.full.js')

		process.env.ASSET_ENV = 'prod'

		const afterSet = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js')
		expect(afterSet).toEqual('mock/path/item.min.js')

		const afterSetWithForce = AssetResolver.assetForEnv('mock/path/item$[.full|.min].js', 'dev')
		expect(afterSetWithForce).toEqual('mock/path/item.full.js')
	})
})
