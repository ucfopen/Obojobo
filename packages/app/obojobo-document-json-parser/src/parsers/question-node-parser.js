const processTriggers = require('../process-triggers')
const processAttrs = require('../process-attrs')

const questionNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const solution = node.content.solution
	let solutionXML = ''

	if (solution) {
		solutionXML = `<solution>` + childrenParser([solution]) + `</solution>`
	}

	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<Question${attrs}${id}>` +
		solutionXML +
		childrenParser(node.children) +
		triggersXML +
		`</Question>`
	)
}

module.exports = questionNodeParser
