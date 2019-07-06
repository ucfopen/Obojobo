const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { gatherClientScriptsFromModules } = require('obojobo-lib-utils')
const docEnginePath = path.dirname(require.resolve('obojobo-document-engine'))
const entriesFromObojoboModules = gatherClientScriptsFromModules()


module.exports =
	// built client files
	(env, argv) => {
		const is_production = argv.mode === 'production'
		const filename_with_min = is_production ? '[name].min' : '[name]'
		console.log(`OboNode client scripts to build ${Object.keys(entriesFromObojoboModules).length}`)
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
					// add utilities for dev env (visit /dev)
					require('./obo_express_dev')(app)
					// add obojobo express server to webpack
					require('./middleware.default')(app)
				},
				publicPath: '/static/',
				watchContentBase: true,
				watchOptions: {
					ignored: '/node_modules/'
				},
				stats: { children: false, modules: false }
			},
			entry: entriesFromObojoboModules,
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
						test: /\.(js|jsx)$/,
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
			plugins: [
				new MiniCssExtractPlugin({ filename: `${filename_with_min}.css` })
			],
			resolve: {
				extensions: ['.js', '.jsx'],
				alias: {
					styles: path.join(docEnginePath, 'src', 'scss')
				}
			}
		}
	}
