module.exports = {
	obojobo: {
		isOptional: true,
		config: 'server/config',
		expressMiddleware: 'server/index.js',
		parsers: 'materia-format-parser.js',
		clientScripts: {
			viewer: 'viewer.js',
			editor: 'editor.js'
		}
	}
}
