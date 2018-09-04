const path = require('path')

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
	// configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
	// You can change the configuration based on that.
	// 'PRODUCTION' is used when building the static version of storybook.

	storybookBaseConfig.module.rules.push(
		{
			test: /\.scss$/,
			loaders: ['style-loader', 'css-loader', 'sass-loader'],
			include: path.resolve(__dirname, '../')
		},
		{
			test: /\.svg/,
			use: {
				loader: 'svg-url-loader',
				options: {
					stripdeclarations: true,
					iesafe: true
				}
			}
		}
	)

	storybookBaseConfig.resolve = {
		alias: {
			Common: path.resolve(__dirname, '../src/scripts/common/index.js')
		}
	}

	// Return the altered config
	return storybookBaseConfig
}
