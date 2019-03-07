module.exports = function(api) {
	api.cache(true)
	return {
		presets: ['@babel/preset-env', '@babel/preset-react'],
		plugins: [['@babel/transform-runtime']],
		env: {
			test: {
				compact: false,
				presets: ['@babel/preset-env', '@babel/preset-react']
			}
		}
	}
}
