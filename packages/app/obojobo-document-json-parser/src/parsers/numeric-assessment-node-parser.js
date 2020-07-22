const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const numericAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const textGroupXML = textGroupParser(node.content.units)

	return (
		`<NumericAssessment${attrs}${id}>` +
		`<units>${textGroupXML}</units>` +
		childrenParser(node.children) +
		triggersXML +
		`</NumericAssessment>`
	)
}

module.exports = numericAssessmentNodeParser
