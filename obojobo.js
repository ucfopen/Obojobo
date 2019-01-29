// this file can be updated to be more uniform
// like the old obojobo.json (and eventually itself can become a json file)

// list for viewer/editor js and css files
const oboNodesClient = [
	'obojobo-chunks-action-button',
	'obojobo-chunks-break',
	'obojobo-chunks-code',
	'obojobo-chunks-figure',
	'obojobo-chunks-heading',
	'obojobo-chunks-html',
	'obojobo-chunks-iframe',
	'obojobo-chunks-list',
	'obojobo-chunks-math-equation',
	'obojobo-chunks-multiple-choice-assessment',
	'obojobo-chunks-question',
	'obojobo-chunks-question-bank',
	'obojobo-chunks-table',
	'obojobo-chunks-text',
	'obojobo-chunks-youtube',
	'obojobo-modules-module',
	'obojobo-pages-page',
	'obojobo-sections-assessment',
	'obojobo-sections-content'
]

// list for server node js files
const oboNodesServer = [
	{
		name: 'ObojoboDraft.Sections.Assessment',
		location: 'server/assessment.js'
	},
	{
		name: 'ObojoboDraft.Chunks.MCAssessment',
		location: 'server/mcassessment.js'
	},
	{
		name: 'ObojoboDraft.Chunks.MCChoice',
		location: 'server/mcchoice.js'
	},
	{
		name: 'ObojoboDraft.Chunks.Question',
		location: 'server/question.js'
	}
]

// list for express files (located in obojobo-document-engine/server)
const oboExpress = ['express.js']

module.exports = {
	oboNodesClient,
	oboNodesServer,
	oboExpress
}
