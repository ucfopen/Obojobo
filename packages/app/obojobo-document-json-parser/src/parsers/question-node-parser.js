const processTriggers = require('../process-triggers')
const processAttrs = require('../process-attrs')
const processObjectives = require('../process-objectives')

const questionNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions', 'solution'])
	const solution = node.content.solution
	let solutionXML = ''

	if (solution) {
		solutionXML = `<solution>` + childrenParser([solution]) + `</solution>`
	}

	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<Question${attrs}${id}>` +
		solutionXML +
		childrenParser(node.children) +
		triggersXML +
		objectivesXML +
		`</Question>`
	)
}

module.exports = questionNodeParser
