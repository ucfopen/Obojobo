module.exports = function(api) {
	api.cache(true)
	return {
		presets: ['@babel/preset-env', '@babel/preset-react'],
		plugins: [['@babel/plugin-transform-runtime', { useESModules: true, absoluteRuntime: true }]],
		sourceType: 'unambiguous',
		env: {
			test: {
				compact: false,
				presets: ['@babel/preset-env', '@babel/preset-react'],
				plugins: ['@babel/plugin-transform-runtime']
			}
		}
	}
}
