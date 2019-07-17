const mcFeedbackNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''

	return `<MCFeedback${id}>` + childrenParser(node.children) + `</MCFeedback>`
}

module.exports = mcFeedbackNodeParser
