const xmlEncode = require('../xml-encode')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const youTubeNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const videoId = xmlEncode(node.content.videoId)
	const attrs = processAttrs(node.content, ['triggers'])
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<YouTube${attrs} videoId="${videoId}"${id}>${triggersXML}</YouTube>`
	}

	return `<YouTube${attrs} videoId="${videoId}"${id}/>`
}

module.exports = youTubeNodeParser
