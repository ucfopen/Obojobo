const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')

const iFrameNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)

	if (triggersXML) {
		return `<IFrame${attrs}${id}>${triggersXML}` + objectivesXML + varsXML + `</IFrame>`
	}

	return `<IFrame${attrs}${id} />`
}

module.exports = iFrameNodeParser
