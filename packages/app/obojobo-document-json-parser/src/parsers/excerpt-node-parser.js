const processTriggers = require('../process-triggers')
const processAttrs = require('../process-attrs')
const processObjectives = require('../process-objectives')

const excerptNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])

	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<Excerpt${attrs}${id}>` +
		childrenParser(node.children) +
		triggersXML +
		objectivesXML +
		`</Excerpt>`
	)
}

module.exports = excerptNodeParser
