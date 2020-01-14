const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const mcChoiceNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return `<MCChoice${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</MCChoice>`
}

module.exports = mcChoiceNodeParser
