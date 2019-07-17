const processAttrs = require('../process-attrs')

const questionBankNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, [])

	return `<QuestionBank${attrs}${id}>` + childrenParser(node.children) + `</QuestionBank>`
}

module.exports = questionBankNodeParser
