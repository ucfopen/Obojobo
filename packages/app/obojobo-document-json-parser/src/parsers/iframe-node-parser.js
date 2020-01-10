const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const iFrameNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<IFrame${attrs}${id}>${triggersXML}</IFrame>`
	}

	return `<IFrame${attrs}${id} />`
}

module.exports = iFrameNodeParser
