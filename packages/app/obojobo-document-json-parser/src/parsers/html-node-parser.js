const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')
const htmlNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)
	if (triggersXML) {
		return `<HTML${attrs}${id}>${triggersXML}`+ objectivesXML + `</HTML>`
	}

	return `<HTML${attrs}${id} />`
}

module.exports = htmlNodeParser
