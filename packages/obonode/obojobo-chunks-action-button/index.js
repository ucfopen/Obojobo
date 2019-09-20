module.exports = {
	obojobo: {
		editorScripts:[
			require('./editor').default
		],
		clientScripts: {
			viewer: 'viewer.js',
			editor: 'editor.js'
		}
	}
}
