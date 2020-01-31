const actionButtonNodeParser = require('./action-button-node-parser/action-button-node-parser')
const assessmentNodeParser = require('./assessment-node-parser/assessment-node-parser')
const breakNodeParser = require('./break-node-parser/break-node-parser')
const codeNodeParser = require('./code-node-parser/code-node-parser')
const contentNodeParser = require('./content-node-parser/content-node-parser')
const figureNodeParser = require('./figure-node-parser/figure-node-parser')
const headingNodeParser = require('./heading-node-parser/heading-node-parser')
const htmlNodeParser = require('./html-node-parser/html-node-parser')
const iFrameNodeParser = require('./iframe-node-parser/iframe-node-parser')
const listNodeParser = require('./list-node-parser/list-node-parser')
const mathEquationNodeParser = require('./math-equation-node-parser/math-equation-node-parser')
const mcAnswerNodeParser = require('./mc-answer-node-parser/mc-answer-node-parser')
const mcAssessmentNodeParser = require('./mc-assessment-node-parser/mcAssessmentNodeParser')
const numericAssessmentNodeParser = require('./numeric-assessment-node-parser/mcAssessmentNodeParser')
const mcChoiceNodeParser = require('./mc-choice-node-parser/mc-choice-node-parser')
const mcFeedbackNodeParser = require('./mc-feedback-node-parser/mc-feedback-node-parser')
const numericFeedbackNodeParser = require('./numeric-feedback-node-parser/mc-feedback-node-parser')
const moduleNodeParser = require('./module-node-parser/module-node-parser')
const pageNodeParser = require('./page-node-parser/page-node-parser')
const questionBankNodeParser = require('./question-bank-node-parser/question-bank-node-parser')
const questionNodeParser = require('./question-node-parser/question-node-parser')
const tableNodeParser = require('./table-node-parser/table-node-parser')
const textNodeParser = require('./text-node-parser/text-node-parser')
const youTubeNodeParser = require('./youtube-node-parser/youtube-node-parser')

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
