var path = require('path');
var webpack = require('webpack')
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bourbon = require('node-bourbon');

var obojoboDraftConfig = {
	entry: {
		'obojobo-draft': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'dist.js')],
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
		'katex': 'katex',
	},
	plugins: [
		new ExtractTextPlugin('[name].css')
	],
	resolve: {
		extensions: ['.js']
	}
}

var viewerConfig = {
	entry: {
		'viewer': ['whatwg-fetch', path.join(__dirname, 'src', 'scripts', 'viewer', 'dist.js')],
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
		'katex': 'katex',
		'ObojoboDraft': 'ObojoboDraft'
	},
	plugins: [
		new ExtractTextPlugin('[name].css')
	],
	resolve: {
		extensions: ['.js']
	}
}

var mainConfig = {
	entry: {
		// 'obojobo-draft': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'dist.js')],
		// 'obojobo-draft-document-editor': [path.join(__dirname, 'src', 'scripts', 'editor', 'obojobo-draft-document-editor.js')],
		// 'obojobo-draft-document-editor-app': [path.join(__dirname, 'src', 'scripts', 'editor', 'obojobo-draft-document-editor-app.js')],
		// 'default-toolbar': [path.join(__dirname, 'src', 'scripts', 'editor', 'default-toolbar.js')],
		'viewer-app': ['whatwg-fetch', path.join(__dirname, 'src', 'scripts', 'viewer', 'obojobo-draft-document-viewer-app.js')],
		'ObojoboDraft.Chunks.ActionButton': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'ActionButton', 'viewer.js')],
		'ObojoboDraft.Chunks.Break': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Break', 'viewer.js')],
		'ObojoboDraft.Chunks.Code': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Code', 'viewer.js')],
		'ObojoboDraft.Chunks.Figure': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Figure', 'viewer.js')],
		'ObojoboDraft.Chunks.Heading': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Heading', 'viewer.js')],
		'ObojoboDraft.Chunks.HTML': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'HTML', 'viewer.js')],
		'ObojoboDraft.Chunks.IFrame': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'IFrame', 'viewer.js')],
		'ObojoboDraft.Chunks.List': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'List', 'viewer.js')],
		'ObojoboDraft.Chunks.MathEquation': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'MathEquation', 'viewer.js')],
		'ObojoboDraft.Chunks.MCAssessment': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'MCAssessment', 'viewer.js')],
		'ObojoboDraft.Chunks.MCAssessment.MCChoice': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'MCAssessment', 'MCChoice', 'viewer.js')],
		'ObojoboDraft.Chunks.Question': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Question', 'viewer.js')],
		'ObojoboDraft.Chunks.QuestionBank': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'QuestionBank', 'viewer.js')],
		'ObojoboDraft.Chunks.Table': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Table', 'viewer.js')],
		'ObojoboDraft.Chunks.Text': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'Text', 'viewer.js')],
		'ObojoboDraft.Chunks.YouTube': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Chunks', 'YouTube', 'viewer.js')],
		'ObojoboDraft.Modules.Module': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Modules', 'Module', 'viewer.js')],
		'ObojoboDraft.Pages.Page': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Pages', 'Page', 'viewer.js')],
		'ObojoboDraft.Sections.Assessment': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Sections', 'Assessment', 'viewer.js')],
		'ObojoboDraft.Sections.Content': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'ObojoboDraft', 'Sections', 'Content', 'viewer.js')]
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
		'katex': 'katex',
		'ObojoboDraft': 'ObojoboDraft',
		'Viewer': 'Viewer'
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

module.exports = [obojoboDraftConfig, viewerConfig, mainConfig];