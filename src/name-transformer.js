let nameTransform = (node) => {
	if(node.type === 'element')
	{
		if(nameTable[node.name])
		{
			node.name = nameTable[node.name]
		}
	}

	for(let i in node.elements)
	{
		nameTransform(node.elements[i])
	}
}

let nameTable = {
	'Code': 'ObojoboDraft.Chunks.Code',
	'Module': 'ObojoboDraft.Modules.Module',
	'Content': 'ObojoboDraft.Sections.Content',
	'Assessment': 'ObojoboDraft.Sections.Assessment',
	'Page': 'ObojoboDraft.Pages.Page',
	'Text': 'ObojoboDraft.Chunks.Text',
	'Heading': 'ObojoboDraft.Chunks.Heading',
	'List': 'ObojoboDraft.Chunks.List',
	'Figure': 'ObojoboDraft.Chunks.Figure',
	'MathEquation': 'ObojoboDraft.Chunks.MathEquation',
	'YouTube': 'ObojoboDraft.Chunks.YouTube',
	'QuestionBank': 'ObojoboDraft.Chunks.QuestionBank',
	'Question': 'ObojoboDraft.Chunks.Question',
	'MCInteraction': 'ObojoboDraft.Chunks.MCInteraction',
	'MCChoice': 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
	'MCAnswer': 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
	'MCFeedback': 'ObojoboDraft.Chunks.MCInteraction.MCFeedback',
	'ActionButton': 'ObojoboDraft.Chunks.ActionButton',
	'Table': 'ObojoboDraft.Chunks.Table',
	'Break': 'ObojoboDraft.Chunks.Break',
	'HTML': 'ObojoboDraft.Chunks.HTML',
	'IFrame': 'ObojoboDraft.Chunks.IFrame'
}

module.exports = nameTransform;