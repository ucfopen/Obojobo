const xmlEncode = require('../xml-encode')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')

const youTubeNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const videoId = xmlEncode(node.content.videoId)
	const attrs = processAttrs(node.content, ['triggers'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	if (triggersXML) {
		return `<YouTube${attrs} videoId="${videoId}"${id}>${triggersXML}${objectivesXML}</YouTube>`
	}

	return `<YouTube${attrs} videoId="${videoId}"${id}/>`
}

module.exports = youTubeNodeParser
