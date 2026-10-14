const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const materiaAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<MateriaAssessment${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		`</MateriaAssessment>`
	)
}

module.exports = materiaAssessmentNodeParser
