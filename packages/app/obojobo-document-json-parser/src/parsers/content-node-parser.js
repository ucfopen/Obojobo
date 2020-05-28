const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const contentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers'])
	const triggersXML = processTriggers(node.content.triggers)

	return `<Content${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</Content>`
}

module.exports = contentNodeParser
