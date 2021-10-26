const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')
const tableNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''

	const header = Boolean(node.content.header)
	const numRows = node.content.textGroup.numRows
	const numCols = node.content.textGroup.numCols

	const attrs = processAttrs(node.content, ['triggers', 'textGroup'])
	const textGroupXML = textGroupParser(node.content.textGroup.textGroup)
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)

	return (
		`<Table numRows="${numRows}" numCols="${numCols}" header="${header}"${attrs}${id}>` +
		textGroupXML +
		triggersXML +
		objectivesXML +
		`</Table>`
	)
}

module.exports = tableNodeParser
