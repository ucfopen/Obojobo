const textGroupParser = require('../text-group-parser')

const textNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const textGroupXML = textGroupParser(node.content.textGroup)

	return `<Text${id}>` + textGroupXML + `</Text>`
}

module.exports = textNodeParser
