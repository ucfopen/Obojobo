const textGroupParser = require('../text-group-parser')
const processTriggers = require('../process-triggers')

const codeNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)

	return `<Code${id}>` + textGroupXML + triggersXML + `</Code>`
}

module.exports = codeNodeParser
