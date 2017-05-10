const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const getInstalledModules = require('./obo_get_installed_modules')

let optimize = process.env.NODE_ENV === "production"
let filename = optimize ? '[name].min' : '[name]'
let docEngineBasePath = path.join(__dirname, 'node_modules', 'obojobo-draft-document-engine', 'build/')
console.log(`Building assets for ${optimize ? 'production' : 'development'}`)


module.exports = {
	target: 'web',
	entry: {
		"viewer": [
			`${docEngineBasePath}obo.js`,
			`${docEngineBasePath}obojobo-draft.js`,
			`${docEngineBasePath}obojobo-draft.css`,
			`${docEngineBasePath}obojobo-draft-document-viewer.js`,
			`${docEngineBasePath}obojobo-draft-document-viewer.css`
		].concat(getInstalledModules(optimize?'production':'development').assets),
		"viewer-app": [`${docEngineBasePath}obojobo-draft-document-viewer-app.js`],
	},
	module: {
		rules:[
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			}
		]
	},
	output: {
		path: path.join(__dirname, 'public', 'compiled'),
		filename: `${filename}.js`
	},
	plugins: [
		new ExtractTextPlugin(`${filename}.css`)
	]
}
