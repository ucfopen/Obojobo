const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const textNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'textGroup'])
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)

	return `<Text${attrs}${id}>` + textGroupXML + triggersXML + `</Text>`
}

module.exports = textNodeParser
