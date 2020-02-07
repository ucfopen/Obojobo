const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const breakNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<Break${attrs}${id}>${triggersXML}</Break>`
	}

	return `<hr${attrs}${id} />`
}

module.exports = breakNodeParser
