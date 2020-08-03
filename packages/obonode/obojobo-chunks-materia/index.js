module.exports = {
	obojobo: {
		// migrations: 'server/migrations',
		expressMiddleware: 'server/index.js',
		parsers: 'materia-format-parser.js',
		clientScripts: {
			viewer: 'viewer.js',
			editor: 'editor.js'
		}
	}
}
