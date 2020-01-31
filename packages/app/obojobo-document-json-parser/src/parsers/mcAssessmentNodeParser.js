const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const mcAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<MCAssessment${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</MCAssessment>`
	)
}

module.exports = mcAssessmentNodeParser
