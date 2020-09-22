const getAllOboNodeScriptPathsByType = require('obojobo-lib-utils').getAllOboNodeScriptPathsByType

const nameMap = new Map()
	.set('ActionButton', 'ObojoboDraft.Chunks.ActionButton')
	.set('Assessment', 'ObojoboDraft.Sections.Assessment')
	.set('Break', 'ObojoboDraft.Chunks.Break')
	.set('Code', 'ObojoboDraft.Chunks.Code')
	.set('Content', 'ObojoboDraft.Sections.Content')
	.set('Figure', 'ObojoboDraft.Chunks.Figure')
	.set('Heading', 'ObojoboDraft.Chunks.Heading')
	.set('HTML', 'ObojoboDraft.Chunks.HTML')
	.set('IFrame', 'ObojoboDraft.Chunks.IFrame')
	.set('List', 'ObojoboDraft.Chunks.List')
	.set('MathEquation', 'ObojoboDraft.Chunks.MathEquation')
	.set('MCAnswer', 'ObojoboDraft.Chunks.MCAssessment.MCAnswer')
	.set('MCAssessment', 'ObojoboDraft.Chunks.MCAssessment')
	.set('MCChoice', 'ObojoboDraft.Chunks.MCAssessment.MCChoice')
	.set('MCFeedback', 'ObojoboDraft.Chunks.MCAssessment.MCFeedback')
	.set('Module', 'ObojoboDraft.Modules.Module')
	.set('Page', 'ObojoboDraft.Pages.Page')
	.set('Question', 'ObojoboDraft.Chunks.Question')
	.set('QuestionBank', 'ObojoboDraft.Chunks.QuestionBank')
	.set('Table', 'ObojoboDraft.Chunks.Table')
	.set('Text', 'ObojoboDraft.Chunks.Text')
	.set('YouTube', 'ObojoboDraft.Chunks.YouTube')

// load name maps dynamically registered
getAllOboNodeScriptPathsByType('parsers').forEach(file => {
	const { name, xmlTag } = require(file)
	nameMap.set(name, xmlTag)
})

const nameTransform = node => {
	if (node.type === 'element') {
		if (nameMap.has(node.name)) {
			node.name = nameMap.get(node.name)
		}
	}

	for (const i in node.elements) {
		nameTransform(node.elements[i])
	}
}


module.exports = nameTransform
