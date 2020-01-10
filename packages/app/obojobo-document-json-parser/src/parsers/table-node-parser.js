const textGroupParser = require('../text-group-parser')
const processTriggers = require('../process-triggers')

const tableNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''

	const header = Boolean(node.content.header)
	const numRows = node.content.textGroup.numRows
	const numCols = node.content.textGroup.numCols

	const textGroupXML = textGroupParser(node.content.textGroup.textGroup)
	const triggersXML = processTriggers(node.content.triggers)

	return (
		`<Table numRows="${numRows}" numCols="${numCols}" header="${header}"${id}>` +
		textGroupXML +
		triggersXML +
		`</Table>`
	)
}

module.exports = tableNodeParser
