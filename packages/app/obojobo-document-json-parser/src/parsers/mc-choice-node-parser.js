const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')

const mcChoiceNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<MCChoice${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		objectivesXML +
		`</MCChoice>`
	)
}

module.exports = mcChoiceNodeParser
