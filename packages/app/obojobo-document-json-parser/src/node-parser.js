const getAllOboNodeScriptPathsByType = require('obojobo-lib-utils').getAllOboNodeScriptPathsByType

const parserMap = new Map()
	.set('ObojoboDraft.Chunks.ActionButton', require('./parsers/action-button-node-parser'))
	.set('ObojoboDraft.Chunks.Break', require('./parsers/break-node-parser'))
	.set('ObojoboDraft.Chunks.Code', require('./parsers/code-node-parser'))
	.set('ObojoboDraft.Chunks.Figure', require('./parsers/figure-node-parser'))
	.set('ObojoboDraft.Chunks.Heading', require('./parsers/heading-node-parser'))
	.set('ObojoboDraft.Chunks.HTML', require('./parsers/html-node-parser'))
	.set('ObojoboDraft.Chunks.IFrame', require('./parsers/iframe-node-parser'))
	.set('ObojoboDraft.Chunks.List', require('./parsers/list-node-parser'))
	.set('ObojoboDraft.Chunks.Materia', require('./parsers/materia-node-parser'))
	.set('ObojoboDraft.Chunks.MathEquation', require('./parsers/math-equation-node-parser'))
	.set('ObojoboDraft.Chunks.MCAssessment.MCAnswer', require('./parsers/mc-answer-node-parser'))
	.set('ObojoboDraft.Chunks.MCAssessment.MCChoice', require('./parsers/mc-choice-node-parser'))
	.set('ObojoboDraft.Chunks.MCAssessment.MCFeedback', require('./parsers/mc-feedback-node-parser'))
	.set('ObojoboDraft.Chunks.MCAssessment', require('./parsers/mcAssessmentNodeParser'))
	.set(
		'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer',
		require('./parsers/numeric-answer-node-parser')
	)
	.set(
		'ObojoboDraft.Chunks.NumericAssessment.NumericChoice',
		require('./parsers/numeric-choice-node-parser')
	)
	.set(
		'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
		require('./parsers/numeric-feedback-node-parser')
	)
	.set('ObojoboDraft.Chunks.NumericAssessment', require('./parsers/numeric-assessment-node-parser'))
	.set('ObojoboDraft.Chunks.Question', require('./parsers/question-node-parser'))
	.set('ObojoboDraft.Chunks.QuestionBank', require('./parsers/question-bank-node-parser'))
	.set('ObojoboDraft.Chunks.Table', require('./parsers/table-node-parser'))
	.set('ObojoboDraft.Chunks.Text', require('./parsers/text-node-parser'))
	.set('ObojoboDraft.Chunks.YouTube', require('./parsers/youtube-node-parser'))
	.set('ObojoboDraft.Modules.Module', require('./parsers/module-node-parser'))
	.set('ObojoboDraft.Pages.Page', require('./parsers/page-node-parser'))
	.set('ObojoboDraft.Sections.Assessment', require('./parsers/assessment-node-parser'))
	.set('ObojoboDraft.Sections.Content', require('./parsers/content-node-parser'))

// load parsers dynamically registered
getAllOboNodeScriptPathsByType('parsers').forEach(file => {
	const { name, xmlToJson } = require(file)
	parserMap.set(name, xmlToJson)
})

const childrenParser = children => {
	if (!children || !Array.isArray(children)) {
		return ''
	}

	let result = ''
	children.forEach(child => {
		const parser = parserMap.get(child.type)
		if (typeof parser !== 'undefined') {
			result += parser(child, childrenParser)
		}
	})

	return result
}

const nodeParser = node => {
	if (!node) return ''
	let result = ''
	const parser = parserMap.get(node.type)

	if (typeof parser !== 'undefined') {
		result += parser(node, childrenParser)
	}

	return result
}

module.exports = nodeParser
