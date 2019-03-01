module.exports = {
	obojoboViewerScripts: 'viewer.js',
	obojoboEditorScripts: 'editor.js',
	obojoboServerScripts: [
		{
			name: 'ObojoboDraft.Sections.Assessment',
			location: 'server/assessment.js'
		}
	],
	obojoboExpressMiddleware: null
}

