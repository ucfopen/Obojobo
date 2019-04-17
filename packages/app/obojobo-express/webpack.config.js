/* eslint-disable no-console */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { getAllOboNodeScriptPathsByType } = require('obojobo-lib-utils')
const viewerOboNodeScripts = getAllOboNodeScriptPathsByType('viewer')
const editorOboNodeScripts = getAllOboNodeScriptPathsByType('editor')
const docEnginePath = path.dirname(require.resolve('obojobo-document-engine'))
const ObojoboExpressDev = require('./obo_express_dev')

module.exports =
	// built client files
	(env, argv) => {
		const is_production = argv.mode === 'production'
		const filename_with_min = is_production ? '[name].min' : '[name]'
		const commonPath = path.join(
			__dirname,
			'..',
			'obojobo-document-engine',
			'src',
			'scripts',
			'common',
			'dist.js'
		)

		console.log(
			`OboNode client scripts to build | viewer: ${viewerOboNodeScripts.length}, editor: ${
				editorOboNodeScripts.length
			}`
		)
		return {
			stats: { children: false, modules: false },
			optimization: { minimize: true },
			performance: { hints: false },
			mode: is_production ? 'production' : 'development',
			target: 'web',
			devServer: {
				https: true,
				host: '127.0.0.1',
				before: app => {
					require('./middleware.default')(app)
				},
				publicPath: '/static/',
				watchContentBase: true,
				watchOptions: {
					ignored: '/node_modules/'
				},
				setup: ObojoboExpressDev,
				stats: { children: false, modules: false }
			},
			entry: {
				viewer: [
					'whatwg-fetch',
					// common (to both viewer and editor)
					commonPath,
					// the application logic
					path.join(docEnginePath, 'src', 'scripts', 'viewer', 'dist.js'),
					// where window and document variables are set and rendering is done
					path.join(docEnginePath, 'src', 'scripts', 'viewer', 'app.js'),
					// all viewer nodes that were registered in obojobo.js
					...viewerOboNodeScripts
				],
				editor: [
					'whatwg-fetch',
					// common (to both viewer and editor)
					commonPath,
					// where window and document variables are set and rendering is done
					// and application logic
					path.join(docEnginePath, 'src', 'scripts', 'oboeditor', 'app.js'),
					// all editor nodes that were registered in obojobo.js
					...editorOboNodeScripts
				]
			},
			output: {
				path: path.join(__dirname, 'public', 'compiled'),
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
			plugins: [new MiniCssExtractPlugin({ filename: `${filename_with_min}.css` })],
			resolve: {
				alias: {
					styles: path.join(docEnginePath, 'src', 'scss')
				}
			}
		}
	}
