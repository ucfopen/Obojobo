const actionButtonNodeParser = require('./parsers/action-button-node-parser')
const assessmentNodeParser = require('./parsers/assessment-node-parser')
const breakNodeParser = require('./parsers/break-node-parser')
const codeNodeParser = require('./parsers/code-node-parser')
const contentNodeParser = require('./parsers/content-node-parser')
const figureNodeParser = require('./parsers/figure-node-parser')
const headingNodeParser = require('./parsers/heading-node-parser')
const htmlNodeParser = require('./parsers/html-node-parser')
const iFrameNodeParser = require('./parsers/iframe-node-parser')
const listNodeParser = require('./parsers/list-node-parser')
const mathEquationNodeParser = require('./parsers/math-equation-node-parser')
const mcAnswerNodeParser = require('./parsers/mc-answer-node-parser')
const mcAssessmentNodeParser = require('./parsers/mcAssessmentNodeParser')
const numericAssessmentNodeParser = require('./parsers/numeric-assessment-node-parser')
const mcChoiceNodeParser = require('./parsers/mc-choice-node-parser')
const mcFeedbackNodeParser = require('./parsers/mc-feedback-node-parser')
const numericChoiceNodeParser = require('./parsers/numeric-choice-node-parser')
const numericAnswerNodeParser = require('./parsers/numeric-answer-node-parser')
const numericFeedbackNodeParser = require('./parsers/numeric-feedback-node-parser')
const moduleNodeParser = require('./parsers/module-node-parser')
const pageNodeParser = require('./parsers/page-node-parser')
const questionBankNodeParser = require('./parsers/question-bank-node-parser')
const questionNodeParser = require('./parsers/question-node-parser')
const tableNodeParser = require('./parsers/table-node-parser')
const textNodeParser = require('./parsers/text-node-parser')
const youTubeNodeParser = require('./parsers/youtube-node-parser')

const parsers = {
	'ObojoboDraft.Chunks.ActionButton': actionButtonNodeParser,
	'ObojoboDraft.Sections.Assessment': assessmentNodeParser,
	'ObojoboDraft.Chunks.Break': breakNodeParser,
	'ObojoboDraft.Chunks.Code': codeNodeParser,
	'ObojoboDraft.Sections.Content': contentNodeParser,
	'ObojoboDraft.Chunks.Figure': figureNodeParser,
	'ObojoboDraft.Chunks.Heading': headingNodeParser,
	'ObojoboDraft.Chunks.HTML': htmlNodeParser,
	'ObojoboDraft.Chunks.IFrame': iFrameNodeParser,
	'ObojoboDraft.Chunks.List': listNodeParser,
	'ObojoboDraft.Chunks.MathEquation': mathEquationNodeParser,
	'ObojoboDraft.Chunks.MCAssessment.MCAnswer': mcAnswerNodeParser,
	'ObojoboDraft.Chunks.MCAssessment': mcAssessmentNodeParser,
	'ObojoboDraft.Chunks.NumericAssessment': numericAssessmentNodeParser,
	'ObojoboDraft.Chunks.MCAssessment.MCChoice': mcChoiceNodeParser,
	'ObojoboDraft.Chunks.MCAssessment.MCFeedback': mcFeedbackNodeParser,
	'ObojoboDraft.Chunks.NumericAssessment.NumericChoice': numericChoiceNodeParser,
	'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer': numericAnswerNodeParser,
	'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback': numericFeedbackNodeParser,
	'ObojoboDraft.Modules.Module': moduleNodeParser,
	'ObojoboDraft.Pages.Page': pageNodeParser,
	'ObojoboDraft.Chunks.QuestionBank': questionBankNodeParser,
	'ObojoboDraft.Chunks.Question': questionNodeParser,
	'ObojoboDraft.Chunks.Table': tableNodeParser,
	'ObojoboDraft.Chunks.Text': textNodeParser,
	'ObojoboDraft.Chunks.YouTube': youTubeNodeParser
}

const childrenParser = children => {
	if (!children || !Array.isArray(children)) {
		return ''
	}

	let result = ''
	children.forEach(child => {
		const parser = parsers[child.type]
		if (typeof parser !== 'undefined') {
			result += parser(child, childrenParser)
		}
	})

	return result
}

const nodeParser = node => {
	if (!node) return ''
	let result = ''
	const parser = parsers[node.type]

	if (typeof parser !== 'undefined') {
		result += parser(node, childrenParser)
	}

	return result
}

module.exports = nodeParser
