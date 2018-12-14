const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { oboNodesClient } = require('./obojobo')

const getOboClientPath = (name, type) => {
	const newPath = name
		.split('.')
		.join('/')
		.concat(`/${type}.js`)
	return path.join(__dirname, 'packages', 'obojobo-document-engine', newPath)
}

// Takes an array of strings of OboNodes
const createClientPathArray = (arr, type) => arr.map(name => getOboClientPath(name, type))
const viewerOboNodes = createClientPathArray(oboNodesClient, 'viewer')
const editorOboNodes = createClientPathArray(oboNodesClient, 'editor')

module.exports =
	// built client files
	(env, argv) => {
		const is_production = argv.mode === 'production'
		const filename_with_min = is_production ? '[name].min' : '[name]'
		const commonPath = path.join(
			__dirname,
			'packages',
			'obojobo-document-engine',
			'src',
			'scripts',
			'common',
			'dist.js'
		)
		console.log(`Building assets for ${is_production ? 'production' : 'development'}`)

		return {
			mode: is_production ? 'production' : 'development',
			target: 'web',
			devServer: {
				https: true,
				host: '127.0.0.1',
				before: app => {
					require('./packages/obojobo-express/middleware.default')(app)
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
					'whatwg-fetch',
					// common (to both viewer and editor)
					commonPath,
					// the application logic
					path.join(
						__dirname,
						'packages',
						'obojobo-document-engine',
						'src',
						'scripts',
						'viewer',
						'dist.js'
					),
					// where window and document variables are set and rendering is done
					path.join(
						__dirname,
						'packages',
						'obojobo-document-engine',
						'src',
						'scripts',
						'viewer',
						'app.js'
					),
					// all viewer nodes that were registered in obojobo.js
					...viewerOboNodes
				],
				editor: [
					'whatwg-fetch',
					// common (to both viewer and editor)
					commonPath,
					// where window and document variables are set and rendering is done
					// and application logic
					path.join(
						__dirname,
						'packages',
						'obojobo-document-engine',
						'src',
						'scripts',
						'oboeditor',
						'app.js'
					),
					// all editor nodes that were registered in obojobo.js
					...editorOboNodes
				]
			},
			output: {
				path: path.join(__dirname, 'packages', 'obojobo-express', 'public', 'compiled'),
				filename: `${filename_with_min}.js`
			},
			module: {
				rules: [
					{
						test: /\.svg/,
						use: {
							loader: 'svg-url-loader',
							options: {
								stripdeclarations: true,
								iesafe: true
							}
						}
					},
					{
						test: /\.js?$/,
						exclude: '/node_modules',
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-react', '@babel/preset-env']
							}
						}
					},
					{
						test: /\.s?css$/,
						use: [
							MiniCssExtractPlugin.loader,
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss',
									plugins: [require('autoprefixer')]
								}
							},
							'sass-loader'
						]
					}
				]
			},
			externals: {
				react: 'React',
				'react-dom': 'ReactDOM',
				backbone: 'Backbone',
				katex: 'katex',
				underscore: '_',
				Common: 'Common',
				Viewer: 'Viewer',
				slate: 'Slate',
				'slate-react': 'SlateReact',
				immutable: 'Immutable'
			},
			plugins: [new MiniCssExtractPlugin()],
			resolve: {
				alias: {
					styles: path.join(__dirname, 'packages', 'obojobo-document-engine', 'src', 'scss')
				}
			}
		}
	}
