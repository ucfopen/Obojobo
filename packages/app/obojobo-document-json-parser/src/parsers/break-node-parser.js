const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')
const breakNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	if (triggersXML) {
		return `<Break${attrs}${id}>${triggersXML}` + objectivesXML + `</Break>`
	}

	return `<hr${attrs}${id} />`
}

module.exports = breakNodeParser
