const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const numericChoicesParser = require('../numeric-choices-parser')

const numericAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions', 'numericChoices'])
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<NumericAssessment${attrs}${id}>` +
		numericChoicesParser(node.content.numericChoices, childrenParser) +
		triggersXML +
		`</NumericAssessment>`
	)
}

module.exports = numericAssessmentNodeParser
