const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')
const iFrameNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	if (triggersXML) {
		return `<IFrame${attrs}${id}>${triggersXML}` + objectivesXML + `</IFrame>`
	}

	return `<IFrame${attrs}${id} />`
}

module.exports = iFrameNodeParser
