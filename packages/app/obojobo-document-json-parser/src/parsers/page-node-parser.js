const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const pageNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return `<Page${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</Page>`
}

module.exports = pageNodeParser
