const xmlEncode = require('../xml-encode')
const processTriggers = require('../process-triggers')

const youTubeNodeParser = node => {
	const content = node.content
	const id = node.id ? ` id="${node.id}"` : ''
	const startTime = content.startTime ? `startTime="${content.startTime}"` : ''
	const endTime = content.endTime ? `endTime="${content.endTime}"` : ''
	const videoId = xmlEncode(node.content.videoId)
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<YouTube videoId="${videoId}"${id} ${startTime} ${endTime}>${triggersXML}</YouTube>`
	}

	return `<YouTube videoId="${videoId}"${id} ${startTime} ${endTime}/>`
}

module.exports = youTubeNodeParser
