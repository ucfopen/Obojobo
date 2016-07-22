var path = require('path');
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
	entry: {
		'obojobo-draft': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft.coffee')],
		// 'obojobo-draft-document-editor': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft-document-editor.coffee')],
		// 'obojobo-draft-document-editor-chunks': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft-document-editor-chunks.coffee')],
		// 'obojobo-draft-document-editor-app': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft-document-editor-app.coffee')],
		// 'obojobo-draft-document-viewer-bootstrap': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft-document-viewer-bootstrap.coffee')],
		// 'obojobo-draft-document-viewer': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft-document-viewer.coffee')]
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
				test: /\.coffee?$/,
				exclude: '/node_modules',
				loaders: ['babel?presets[]=react&presets[]=es2015', 'coffee-loader']
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(['css', 'sass'])
			}
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'backbone': 'Backbone',
	},
	plugins: [
		// @TODO next 3 copied from old production do we need?
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		// end todo

		// new webpack.optimize.CommonsChunkPlugin('common-'),

		new ExtractTextPlugin({
			filename: "[name].css",
			allChunks: true
		})
	],
	resolve: {
		extensions: ['', '.js', '.coffee']
	}
}


module.exports = config;