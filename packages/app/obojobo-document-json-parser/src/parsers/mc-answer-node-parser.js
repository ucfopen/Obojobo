const processTriggers = require('../process-triggers')

const mcAnswerNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const triggersXML = processTriggers(node.content.triggers)

	return `<MCAnswer${id}>` + childrenParser(node.children) + triggersXML + `</MCAnswer>`
}

module.exports = mcAnswerNodeParser
