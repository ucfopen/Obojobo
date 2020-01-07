const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const questionBankNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<QuestionBank${attrs}${id}>` + childrenParser(node.children) + triggersXML + `</QuestionBank>`
	)
}

module.exports = questionBankNodeParser
