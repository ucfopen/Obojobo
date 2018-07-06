global.oboRequire = name => {
	return require(`${__dirname}/${name}`)
}
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getInstalledModules = require('./obo_get_installed_modules')
const docEngineBasePath = path.join(
	__dirname,
	'node_modules',
	'obojobo-draft-document-engine',
	'build'
)

module.exports = (env, argv) => {
	const is_production = argv.mode === 'production'
	const filename_with_min = is_production ? '[name].min' : '[name]'
	console.log(`Building assets for ${is_production ? 'production' : 'development'}`)

	return {
		target: 'web',
		devServer: {
			https: true,
			host: '127.0.0.1',
			setup: app => {
				require('./middleware.default')(app)
			},
			publicPath: '/static/',
			watchContentBase: true,
			watchOptions: {
				ignored: '/node_modules/'
			},
			stats: { children: false }
		},
		entry: {
			viewer: [
				`${docEngineBasePath}/common.js`,
				`${docEngineBasePath}/common.css`,
				`${docEngineBasePath}/viewer.js`,
				`${docEngineBasePath}/viewer.css`,
				`${docEngineBasePath}/viewer-app.js`
			].concat(getInstalledModules(is_production ? 'production' : 'development').assets)
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader']
				}
			]
		},
		output: {
			path: path.join(__dirname, 'public', 'compiled'),
			filename: `${filename_with_min}.js`
		},
		plugins: [new MiniCssExtractPlugin({filename: `${filename_with_min}.css`})]
	}
}
