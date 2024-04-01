module.exports = {
	obojobo: {
		isOptional: true,
		expressMiddleware: 'server/index.js',
		clientScripts: {
			viewer: 'viewer.js',
			editor: 'editor.js'
		},
		serverScripts: ['server/materiaassessment']
	}
}
