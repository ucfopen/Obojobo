const processTriggers = require('../process-triggers')
const processAttrs = require('../process-attrs')

const numericAnswerNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<NumericAnswer${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		`</NumericAnswer>`
	)
}

module.exports = numericAnswerNodeParser
