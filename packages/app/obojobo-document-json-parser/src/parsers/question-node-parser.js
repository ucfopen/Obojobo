const processTriggers = require('../process-triggers')

const questionNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const solution = node.content.solution
	let solutionXML = ''

	if (solution) {
		solutionXML = `<solution>` + childrenParser([solution]) + `</solution>`
	}

	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<Question${id}>` + solutionXML + childrenParser(node.children) + triggersXML + `</Question>`
	)
}

module.exports = questionNodeParser
