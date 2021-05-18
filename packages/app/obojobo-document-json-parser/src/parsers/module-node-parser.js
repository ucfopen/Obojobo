const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')

const moduleNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''

	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const varsXML = processVars(node.content.variables)

	return (
		`<Module${attrs}${id}>` + varsXML + childrenParser(node.children) + triggersXML + `</Module>`
	)
}

module.exports = moduleNodeParser
