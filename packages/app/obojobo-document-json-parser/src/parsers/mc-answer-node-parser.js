const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const mcAnswerNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers'])
	const triggersXML = processTriggers(node.content.triggers)

	return `<MCAnswer${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</MCAnswer>`
}

module.exports = mcAnswerNodeParser
