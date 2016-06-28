var path = require('path');
var webpack = require('webpack')
var StatsPlugin = require('stats-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// must match config.webpack.dev_server.port
// var devServerPort = 3808;

// set TARGET=production on the environment to add asset fingerprints
var production = process.env.TARGET === 'production';

var config = {
	entry: {
		'editor': [path.join(__dirname, 'src', 'scripts', 'node_modules', 'editor.coffee')]
	},
	output: {
		// must match config.webpack.output_dir
		path: path.join(__dirname, 'build'),
		publicPath: 'assets/',
		filename: production ? '[name]-[chunkhash].js' : '[name].js'
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
		}),
		//must match config.webpack.manifest_filename
		new StatsPlugin('manifest.json', {
			// We only need assetsByChunkName
			chunkModules: false,
			source: false,
			chunks: false,
			modules: false,
			assets: true
		})
	],
	resolve: {
		extensions: ['', '.js', '.coffee']
	}
}

if (production) {
	config.plugins.push(
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compressor: { warnings: false },
			sourceMap: false
		}),
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify('production') }
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin()
	);
} else {
	// config.devServer = {
	// 	port: devServerPort,
	// 	headers: { 'Access-Control-Allow-Origin': '*' }
	// };
	//config.output.publicPath = '//localhost:' + devServerPort + '/webpack/';
	// Source maps
	// config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;