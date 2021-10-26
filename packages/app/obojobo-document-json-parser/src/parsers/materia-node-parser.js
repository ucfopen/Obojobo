const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')
const materiaNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)
	const textGroupXML = textGroupParser(node.content.textGroup)

	if (textGroupXML || triggersXML) {
		return `<Materia${attrs}${id}>${textGroupXML}${triggersXML}${objectivesXML}</Materia>`
	}

	return `<Materia${attrs}${id} />`
}

module.exports = materiaNodeParser
