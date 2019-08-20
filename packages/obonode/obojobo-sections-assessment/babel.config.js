module.exports = function(api) {
	api.cache(true)
	return {
		presets: ['@babel/preset-env', '@babel/preset-react'],
		env: {
			test: {
				presets: ['@babel/preset-env', '@babel/preset-react'],
				// enables use of async in tests
				targets: {
					node: 'current'
				}
			}
		}
	}
}
