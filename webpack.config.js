var path = require('path');
var webpack = require('webpack')
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bourbon = require('node-bourbon');


var config = {
	entry: {
		'obo': [path.join(__dirname, 'src', 'scripts', 'obo.coffee')],
		'obojobo-draft': [path.join(__dirname, 'src', 'scripts', 'obojobo-draft.coffee')],
		// 'obojobo-draft-document-editor': [path.join(__dirname, 'src', 'scripts', 'editor', 'obojobo-draft-document-editor.coffee')],
		// 'obojobo-draft-document-editor-app': [path.join(__dirname, 'src', 'scripts', 'editor', 'obojobo-draft-document-editor-app.coffee')],
		// 'default-toolbar': [path.join(__dirname, 'src', 'scripts', 'editor', 'default-toolbar.coffee')],
		'obojobo-draft-document-viewer': [path.join(__dirname, 'src', 'scripts', 'viewer', 'obojobo-draft-document-viewer.coffee')],
		'obojobo-draft-document-viewer-app': ['whatwg-fetch', path.join(__dirname, 'src', 'scripts', 'viewer', 'obojobo-draft-document-viewer-app.coffee')],
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
				test: /\.(cur)$/,
				loaders: ['url-loader?limit=10000']
			},
			{
				test: /\.s?css$/,
				loader: ExtractTextPlugin.extract(['css', 'sass?includePaths[]=' + bourbon.includePaths])
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

		new ExtractTextPlugin('[name].css')
	],
	resolve: {
		extensions: ['', '.js', '.coffee']
	}
}


// var files = glob.sync(path.join(__dirname, 'src', 'scripts', 'node_modules', 'chunks', 'src', '**/editor.coffee'))
// for(file in files)
// {
// 	var dir = files[file].split(path.sep)
// 	var chunkName = dir[dir.length - 2];

// 	config.entry[path.join('chunks', 'editor', chunkName)] = [files[file]]
// }

// var files = glob.sync(path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', '**/viewer.coffee'))
var files = glob.sync(path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', '**', 'viewer2.coffee'))
console.log('files be all like', files)
for(file in files)
{
	var str = files[file]
	var dir = str.substr(str.indexOf('ObojoboDraft')).split(path.sep)
	console.log('dir', dir)
	dir.pop()
	console.log('dir', dir)
	var itemName = dir.join('.')

	config.entry[itemName] = [files[file]]
}


// config.entry.test = [path.join(__dirname, 'src', 'scripts', 'node_modules', 'chunks', 'src', 'core', 'base', 'Break', 'editor.coffee')]

console.log(config.entry)

module.exports = config;