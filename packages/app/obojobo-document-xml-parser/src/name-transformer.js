const nameTransform = node => {
	if (node.type === 'element') {
		if (nameTable[node.name]) {
			node.name = nameTable[node.name]
		}
	}

	for (const i in node.elements) {
		nameTransform(node.elements[i])
	}
}

const nameTable = {
	Code: 'ObojoboDraft.Chunks.Code',
	Module: 'ObojoboDraft.Modules.Module',
	Content: 'ObojoboDraft.Sections.Content',
	Assessment: 'ObojoboDraft.Sections.Assessment',
	Page: 'ObojoboDraft.Pages.Page',
	Text: 'ObojoboDraft.Chunks.Text',
	Heading: 'ObojoboDraft.Chunks.Heading',
	List: 'ObojoboDraft.Chunks.List',
	Figure: 'ObojoboDraft.Chunks.Figure',
	MathEquation: 'ObojoboDraft.Chunks.MathEquation',
	YouTube: 'ObojoboDraft.Chunks.YouTube',
	QuestionBank: 'ObojoboDraft.Chunks.QuestionBank',
	Question: 'ObojoboDraft.Chunks.Question',
	MCAssessment: 'ObojoboDraft.Chunks.MCAssessment',
	NumericAssessment: 'ObojoboDraft.Chunks.NumericAssessment',
	MCChoice: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
	MCAnswer: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
	MCFeedback: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
	NumericChoice: 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
	NumericAnswer: 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer',
	NumericFeedback: 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
	ActionButton: 'ObojoboDraft.Chunks.ActionButton',
	Table: 'ObojoboDraft.Chunks.Table',
	Break: 'ObojoboDraft.Chunks.Break',
	HTML: 'ObojoboDraft.Chunks.HTML',
	IFrame: 'ObojoboDraft.Chunks.IFrame'
}

module.exports = nameTransform
