import lti from '../lti'
import middleware from '../middleware.default.js'

jest.mock('fs', () =>
	// Node 10 and Jest 23 and fs (used by 'mini-css-extract-plugin')
	// die when running tests for mysterious reasons.
	// Should remove this when we can get these packages to align!
	// More info: https://github.com/facebook/jest/pull/6532/files
	// And: https://github.com/facebook/jest/pull/6532
	Object.assign({}, jest.genMockFromModule('fs'), {
		ReadStream: require.requireActual('fs').ReadStream,
		WriteStream: require.requireActual('fs').WriteStream,
		dirname: require.requireActual('fs').dirname,
		realpathSync: require.requireActual('fs').realpathSync
	})
)
jest.mock('express')
jest.mock('../obo_get_installed_modules')
jest.mock('mini-css-extract-plugin')
jest.mock('../middleware.default.js', () => {
	return jest.fn()
})

const env_node = process.env.NODE_ENV
process.env.NODE_ENV = 'production'
// Prevent webpack from printing to console
const originalLog = console.log
console.log = jest.fn()
const webpack = require('../webpack.config.js')
console.log = originalLog

describe('Webpack', () => {
	afterAll(() => {
		process.env.NODE_ENV = env_node
	})

	test('Webpack builds expected object', () => {
		expect(webpack(null, { mode: 'production' })).toEqual({
			devServer: {
				host: '127.0.0.1',
				https: true,
				publicPath: '/static/',
				setup: expect.any(Function),
				stats: { children: false },
				watchContentBase: true,
				watchOptions: { ignored: '/node_modules/' }
			},
			entry: { viewer: expect.any(Array) },
			module: { rules: expect.any(Array) },
			output: {
				filename: '[name].min.js',
				path: expect.any(String)
			},
			plugins: expect.any(Array),
			target: 'web'
		})
	})

	test('oboRequire requires named file', () => {
		const thing = oboRequire('lti')
		expect(thing).toEqual(lti)
	})

	test('setup requires middleware', () => {
		webpack(null, { mode: 'production' }).devServer.setup({})

		expect(middleware).toHaveBeenCalled()
	})

	test('Webpack uses min filenames in production', () => {
		expect(webpack(null, { mode: 'production' }).output).toHaveProperty('filename', '[name].min.js')
	})

	test('Webpack doesnt use min in development', () => {
		expect(webpack(null, { mode: 'development' }).output).toHaveProperty('filename', '[name].js')
	})
})
