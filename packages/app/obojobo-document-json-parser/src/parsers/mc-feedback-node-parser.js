const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')

const mcFeedbackNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<MCFeedback${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		objectivesXML +
		`</MCFeedback>`
	)
}

module.exports = mcFeedbackNodeParser
