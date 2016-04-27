var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		// 'obodraft': ['./src/scripts/node_modules/app/OboDraft.coffee'],
		'editor': ['./src/scripts/node_modules/editor.coffee'],
		// 'thing': ['./src/scripts/thing/something.coffee'],
	},
	output: {
		filename: '[name].js',
		publicPath: 'http://localhost:8090/assets'
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
		new ExtractTextPlugin('style.css', {
			allChunks: true
		})
	],
	resolve: {
		extensions: ['', '.js', '.coffee']
	}
}