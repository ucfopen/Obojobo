const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const mcFeedbackNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers'])
	const triggersXML = processTriggers(node.content.triggers)

	return `<MCFeedback${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</MCFeedback>`
}

module.exports = mcFeedbackNodeParser
