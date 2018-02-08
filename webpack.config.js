var path = require('path')
var webpack = require('webpack')
var glob = require('glob')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var bourbon = require('node-bourbon')

var obojoboDraftConfig = {
	entry: {
		common: [path.join(__dirname, 'src', 'scripts', 'common', 'dist.js')]
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
				loader: ExtractTextPlugin.extract([
					'css-loader',
					'sass-loader?includePaths[]=' + bourbon.includePaths
				])
			}
		]
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		backbone: 'Backbone',
		katex: 'katex'
	},
	plugins: [new ExtractTextPlugin('[name].css')]
}

var viewerConfig = {
	entry: {
		viewer: ['whatwg-fetch', path.join(__dirname, 'src', 'scripts', 'viewer', 'dist.js')]
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
				loader: ExtractTextPlugin.extract([
					'css-loader',
					'sass-loader?includePaths[]=' + bourbon.includePaths
				])
			}
		]
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		backbone: 'Backbone',
		katex: 'katex',
		Common: 'Common'
	},
	plugins: [new ExtractTextPlugin('[name].css')]
}

var mainConfig = {
	entry: {
		'viewer-app': ['whatwg-fetch', path.join(__dirname, 'src', 'scripts', 'viewer', 'app.js')],
		'ObojoboDraft.Chunks.ActionButton': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'ActionButton', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Break': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Break', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Code': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Code', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Figure': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Figure', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Heading': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Heading', 'viewer.js')
		],
		'ObojoboDraft.Chunks.HTML': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'HTML', 'viewer.js')
		],
		'ObojoboDraft.Chunks.IFrame': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'IFrame', 'viewer.js')
		],
		'ObojoboDraft.Chunks.List': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'List', 'viewer.js')
		],
		'ObojoboDraft.Chunks.MathEquation': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'MathEquation', 'viewer.js')
		],
		'ObojoboDraft.Chunks.MCInteraction': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'MCInteraction', 'viewer.js')
		],
		'ObojoboDraft.Chunks.MCInteraction.MCChoice': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'MCInteraction', 'MCChoice', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Question': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Question', 'viewer.js')
		],
		'ObojoboDraft.Chunks.QuestionBank': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'QuestionBank', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Table': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Table', 'viewer.js')
		],
		'ObojoboDraft.Chunks.Text': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'Text', 'viewer.js')
		],
		'ObojoboDraft.Chunks.YouTube': [
			path.join(__dirname, 'ObojoboDraft', 'Chunks', 'YouTube', 'viewer.js')
		],
		'ObojoboDraft.Modules.Module': [
			path.join(__dirname, 'ObojoboDraft', 'Modules', 'Module', 'viewer.js')
		],
		'ObojoboDraft.Pages.Page': [path.join(__dirname, 'ObojoboDraft', 'Pages', 'Page', 'viewer.js')],
		'ObojoboDraft.Sections.Assessment': [
			path.join(__dirname, 'ObojoboDraft', 'Sections', 'Assessment', 'viewer.js')
		],
		'ObojoboDraft.Sections.Content': [
			path.join(__dirname, 'ObojoboDraft', 'Sections', 'Content', 'viewer.js')
		]
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
				loader: ExtractTextPlugin.extract([
					'css-loader',
					'sass-loader?includePaths[]=' + bourbon.includePaths
				])
			}
		]
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		backbone: 'Backbone',
		katex: 'katex',
		Common: 'Common',
		Viewer: 'Viewer'
	},
	plugins: [new ExtractTextPlugin('[name].css')],
	resolve: {
		alias: {
			styles: path.join(__dirname, 'src', 'scss')
		}
	}
}

module.exports = [obojoboDraftConfig, viewerConfig, mainConfig]
