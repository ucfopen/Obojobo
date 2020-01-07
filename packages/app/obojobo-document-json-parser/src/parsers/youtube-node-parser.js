const xmlEncode = require('../xml-encode')
const processTriggers = require('../process-triggers')

const youTubeNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const videoId = xmlEncode(node.content.videoId)
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<YouTube videoId="${videoId}"${id}>${triggersXML}</YouTube>`
	}

	return `<YouTube videoId="${videoId}"${id}/>`
}

module.exports = youTubeNodeParser
