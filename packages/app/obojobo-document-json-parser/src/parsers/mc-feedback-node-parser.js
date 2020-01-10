const processTriggers = require('../process-triggers')

const mcFeedbackNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const triggersXML = processTriggers(node.content.triggers)

	return `<MCFeedback${id}>` + childrenParser(node.children) + triggersXML + `</MCFeedback>`
}

module.exports = mcFeedbackNodeParser
