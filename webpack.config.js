global.oboRequire = name => {
	return require(`${__dirname}/${name}`)
}
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getInstalledModules = require('./obo_get_installed_modules')

const optimize = process.env.NODE_ENV === 'production'
const filename = optimize ? '[name].min' : '[name]'
const docEngineBasePath = path.join(
	__dirname,
	'node_modules',
	'obojobo-draft-document-engine',
	'build'
)
console.log(`Building assets for ${optimize ? 'production' : 'development'}`)

module.exports = {
	mode: optimize ? 'production' : 'development',
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
		].concat(getInstalledModules(optimize ? 'production' : 'development').assets)
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
		filename: `${filename}.js`
	},
	plugins: [new MiniCssExtractPlugin({filename: `${filename}.css`})]
}
