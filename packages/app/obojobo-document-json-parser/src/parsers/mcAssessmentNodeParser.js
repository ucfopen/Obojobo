const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')

const mcAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<MCAssessment${attrs}${id}>` + childrenParser(node.children) + triggersXML + objectivesXML + `</MCAssessment>`
	)
}

module.exports = mcAssessmentNodeParser
