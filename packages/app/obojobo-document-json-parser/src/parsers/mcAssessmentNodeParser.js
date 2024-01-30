const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')

const mcAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<MCAssessment${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		objectivesXML +
		varsXML +
		`</MCAssessment>`
	)
}

module.exports = mcAssessmentNodeParser
