import lti from '../lti'
import middleware from '../middleware.default.js'

jest.mock('express')
jest.mock('../obo_get_installed_modules')
jest.mock('extract-text-webpack-plugin')
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
		expect(webpack).toEqual({
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
		let thing = oboRequire('lti')
		expect(thing).toEqual(lti)
	})

	test('setup requires middleware', () => {
		webpack.devServer.setup({})

		expect(middleware).toHaveBeenCalled()
	})
})
