const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackOnBuildPlugin = require('on-build-webpack');
const concat = require('concat-files');
const getInstalledModules = require('./obo_get_installed_modules')

let optimize = process.env.NODE_ENV === "production"
let filename = optimize ? '[name].min' : '[name]'
let docEngineBasePath = path.join(__dirname, 'node_modules', 'obojobo-draft-document-engine', 'build/')
console.log(`Building assets for ${optimize ? 'production' : 'development'}`)

// after webpack is done, concatinate files
let concatAfter = () => {
	let basePath = path.join(__dirname, 'public', 'compiled', path.sep)
	let m = optimize ? '.min' : ''

	concat([
		`${basePath}_obo${m}.js`,
		`${basePath}_obo-draft${m}.js`,
		`${basePath}_obo-draft-document-viewer${m}.js`,
		`${basePath}_obo-draft-chunks${m}.js`,
		`${basePath}_obo-draft-document-viewer-app${m}.js`,
		],
		`${basePath}viewer${m}.js`
	)

	concat([
		`${basePath}_obo-draft${m}.css`,
		`${basePath}_obo-draft-document-viewer${m}.css`,
		`${basePath}_obo-draft-chunks${m}.css`,
		],
		`${basePath}viewer${m}.css`
	)
}

module.exports = {
	target: 'web',
	entry: {
		"_obo": [`${docEngineBasePath}obo.js`],
		"_obo-draft": [`${docEngineBasePath}obojobo-draft.js`, `${docEngineBasePath}obojobo-draft.css`],
		"_obo-draft-document-viewer": [`${docEngineBasePath}obojobo-draft-document-viewer.js`, `${docEngineBasePath}obojobo-draft-document-viewer.css`],
		"_obo-draft-document-viewer-app": [`${docEngineBasePath}obojobo-draft-document-viewer-app.js`],
		"_obo-draft-chunks": getInstalledModules(optimize?'production':'development').assets,
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
		new ExtractTextPlugin(`${filename}.css`),
		new WebpackOnBuildPlugin(concatAfter),
	]
}
