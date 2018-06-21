import lti from '../lti'

jest.mock('express')
jest.mock('../obo_get_installed_modules')
jest.mock('extract-text-webpack-plugin')
jest.mock('../middleware.default.js') // Does not seem to actually mock middleware

const webpack = require('../webpack.config.js')

describe('Webpack', () => {
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
				filename: '[name].js',
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

	test.skip('setup requires middleware', () => {
		const app = require('../app')
		webpack.devServer.setup(app)
	})
})
