const processTriggers = require('../process-triggers')

const contentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const triggersXML = processTriggers(node.content.triggers)

	return `<Content${id}>` + childrenParser(node.children) + triggersXML + `</Content>`
}

module.exports = contentNodeParser
