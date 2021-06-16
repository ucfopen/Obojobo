const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const numericChoiceNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<NumericChoice${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		`</NumericChoice>`
	)
}

module.exports = numericChoiceNodeParser
