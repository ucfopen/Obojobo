const textGroupParser = require('obojobo-document-json-parser/src/text-group-parser')
const processAttrs = require('obojobo-document-json-parser/src/process-attrs')
const processTriggers = require('obojobo-document-json-parser/src/process-triggers')

const name = 'ObojoboDraft.Chunks.Materia'
const xmlTag = 'Materia'
const xmlToJson = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const textGroupXML = textGroupParser(node.content.textGroup)

	if (textGroupXML || triggersXML) {
		return `<${xmlTag}${attrs}${id}>${textGroupXML}${triggersXML}</${xmlTag}>`
	}

	return `<${xmlTag}${attrs}${id} />`
}

module.exports = {
	name,
	xmlTag,
	xmlToJson
}
