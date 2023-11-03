const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')
const codeNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'textGroup'])
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)

	return `<Code${attrs}${id}>` + textGroupXML + triggersXML + objectivesXML + varsXML `</Code>`
}

module.exports = codeNodeParser
