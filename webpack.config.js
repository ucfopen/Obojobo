var path = require('path');
var webpack = require('webpack')
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bourbon = require('node-bourbon');


var config = {
	entry: {
		// 'obojobo-draft': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'index.js')],
		// 'obojobo-draft-document-editor': [path.join(__dirname, 'src', 'scripts', 'editor', 'obojobo-draft-document-editor.js')],
		// 'obojobo-draft-document-editor-app': [path.join(__dirname, 'src', 'scripts', 'editor', 'obojobo-draft-document-editor-app.js')],
		// 'default-toolbar': [path.join(__dirname, 'src', 'scripts', 'editor', 'default-toolbar.js')],
		'viewer': ['whatwg-fetch', path.join(__dirname, 'src', 'scripts', 'viewer', 'obojobo-draft-document-viewer-app.js')],
	},
	output: {
		// must match config.webpack.output_dir
		path: path.join(__dirname, 'build'),
		publicPath: 'build/',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: '/node_modules',
				loaders: ['babel-loader?presets[]=react&presets[]=es2015']
			},
			{
				test: /\.s?css$/,
				loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader?includePaths[]=' + bourbon.includePaths])
			}
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'backbone': 'Backbone',
		'katex': 'katex'
	},
	plugins: [
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'viewer-bundle',
		// 	filename: 'viewer-bundle.js'
		// }),
		new ExtractTextPlugin('[name].css')
	],
	resolve: {
		extensions: ['.js']
	}
}

module.exports = config;