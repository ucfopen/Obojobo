const textGroupParser = require('../text-group-parser')
const processTriggers = require('../process-triggers')
const processAttrs = require('../process-attrs')

const actionButtonNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'textGroup', 'actions'])
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)

	return `<ActionButton${attrs}${id}>` + textGroupXML + triggersXML + `</ActionButton>`
}

module.exports = actionButtonNodeParser
