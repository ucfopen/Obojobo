const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')
const htmlNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)
	if (triggersXML) {
		return `<HTML${attrs}${id}>${triggersXML}` + objectivesXML + varsXML + `</HTML>`
	}

	return `<HTML${attrs}${id} />`
}

module.exports = htmlNodeParser
