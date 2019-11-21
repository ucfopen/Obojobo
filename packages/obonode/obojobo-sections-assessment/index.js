module.exports = {
	obojobo: {
		// @TODO: move migrations !
		migrations: 'migrations',
		serverScripts: 'server/assessment.js',
		expressMiddleware: 'server/express.js',
		clientScripts: {
			viewer: 'viewer.js',
			editor: 'editor.js'
		}
	}
}
