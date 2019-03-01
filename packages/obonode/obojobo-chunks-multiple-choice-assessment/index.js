module.exports = {
	obojoboViewerScripts: 'viewer.js',
	obojoboEditorScripts: 'editor.js',
	obojoboServerScripts: [
		{
			name: 'ObojoboDraft.Chunks.MCAssessment',
			location: 'server/mcassessment.js'
		},
		{
			name: 'ObojoboDraft.Chunks.MCChoice',
			location: 'server/mcchoice.js'
		}
	],
	obojoboExpressMiddleware: null
}
