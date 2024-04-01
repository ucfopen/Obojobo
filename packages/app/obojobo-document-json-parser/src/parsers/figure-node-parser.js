const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')
const figureNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)
	const attrs = processAttrs(node.content, ['textGroup', 'triggers', 'actions'])
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<Figure${attrs}${id}>` + textGroupXML + triggersXML + objectivesXML + varsXML + `</Figure>`
	)
}

module.exports = figureNodeParser
