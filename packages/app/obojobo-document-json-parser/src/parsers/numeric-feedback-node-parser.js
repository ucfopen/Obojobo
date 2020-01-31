const processTriggers = require('../process-triggers')

const numericFeedbackNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<NumericFeedback${id}>` + childrenParser(node.children) + triggersXML + `</NumericFeedback>`
	)
}

module.exports = numericFeedbackNodeParser
