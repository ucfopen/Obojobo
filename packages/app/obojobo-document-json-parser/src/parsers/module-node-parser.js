const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const moduleNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''

	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return `<Module${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</Module>`
}

module.exports = moduleNodeParser
