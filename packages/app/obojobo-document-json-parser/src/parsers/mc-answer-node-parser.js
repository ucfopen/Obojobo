const mcAnswerNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''

	return `<MCAnswer${id}>` + childrenParser(node.children) + `</MCAnswer>`
}

module.exports = mcAnswerNodeParser
