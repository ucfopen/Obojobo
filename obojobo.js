// this file can be updated to be more uniform
// like the old obojobo.json (and eventually itself can become a json file)

// list for viewer/editor js and css files
const oboNodesClient = [
	'ObojoboDraft.Chunks.ActionButton',
	'ObojoboDraft.Chunks.Break',
	'ObojoboDraft.Chunks.Code',
	'ObojoboDraft.Chunks.Figure',
	'ObojoboDraft.Chunks.Heading',
	'ObojoboDraft.Chunks.HTML',
	'ObojoboDraft.Chunks.IFrame',
	'ObojoboDraft.Chunks.List',
	'ObojoboDraft.Chunks.MathEquation',
	'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
	'ObojoboDraft.Chunks.MCAssessment.MCChoice',
	'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
	'ObojoboDraft.Chunks.MCAssessment',
	'ObojoboDraft.Chunks.Question',
	'ObojoboDraft.Chunks.QuestionBank',
	'ObojoboDraft.Chunks.Table',
	'ObojoboDraft.Chunks.Text',
	'ObojoboDraft.Chunks.YouTube',
	'ObojoboDraft.Modules.Module',
	'ObojoboDraft.Pages.Page',
	'ObojoboDraft.Sections.Assessment',
	'ObojoboDraft.Sections.Content'
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
