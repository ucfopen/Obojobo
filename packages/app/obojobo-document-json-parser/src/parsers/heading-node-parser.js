const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')
const headingNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''

	const headingLevel = node.content.headingLevel
		? `headingLevel="${node.content.headingLevel}"`
		: ''
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)
	const attrs = processAttrs(node.content, ['triggers', 'textGroup'])

	return `<Heading ${headingLevel}${attrs}${id}>` + textGroupXML + triggersXML + objectivesXML + `</Heading>`
}

module.exports = headingNodeParser
