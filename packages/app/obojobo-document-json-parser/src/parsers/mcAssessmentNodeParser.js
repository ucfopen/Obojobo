const processAttrs = require('../process-attrs')

const mcAssessmentNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, [])

	return `<MCAssessment${attrs}${id}>` + childrenParser(node.children) + `</MCAssessment>`
}

module.exports = mcAssessmentNodeParser
