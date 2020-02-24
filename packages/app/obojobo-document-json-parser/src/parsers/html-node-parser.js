const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const htmlNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<HTML${attrs}${id}>${triggersXML}</HTML>`
	}

	return `<HTML${attrs}${id} />`
}

module.exports = htmlNodeParser
