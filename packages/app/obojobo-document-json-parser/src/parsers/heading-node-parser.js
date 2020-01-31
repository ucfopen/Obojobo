const textGroupParser = require('../text-group-parser')
const processTriggers = require('../process-triggers')

const headingNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''

	const headingLevel = node.content.headingLevel
		? `headingLevel="${node.content.headingLevel}"`
		: ''
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)

	return `<Heading ${headingLevel}${id}>` + textGroupXML + triggersXML + `</Heading>`
}

module.exports = headingNodeParser
