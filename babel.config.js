module.exports = function(api) {
	api.cache(true)
	return {
		compact: false,
		presets: ['@babel/preset-env', '@babel/preset-react'],
		env: {
			test: {
				compact: false,
				presets: ['@babel/preset-env', '@babel/preset-react'],
				plugins: [['@babel/transform-runtime']]
			}
		}
	}
}
