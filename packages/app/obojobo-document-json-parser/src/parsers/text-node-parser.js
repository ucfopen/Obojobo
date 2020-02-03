const textGroupParser = require('../text-group-parser')
const processTriggers = require('../process-triggers')

const textNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)

	return `<Text${id}>` + textGroupXML + triggersXML + `</Text>`
}

module.exports = textNodeParser
