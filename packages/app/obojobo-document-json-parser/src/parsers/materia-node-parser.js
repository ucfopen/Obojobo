const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processVars = require('../process-vars')
const processObjectives = require('../process-objectives')

const materiaNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const textGroupXML = textGroupParser(node.content.textGroup)
	const varsXML = processVars(node.content.variables)
	const objectivesXML = processObjectives(node.content.objectives)

	if (textGroupXML || triggersXML) {
		return `<Materia${attrs}${id}>${textGroupXML}${triggersXML}${objectivesXML}${varsXML}</Materia>`
	}

	return `<Materia${attrs}${id} />`
}

module.exports = materiaNodeParser
