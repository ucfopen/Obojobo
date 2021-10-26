const textGroupParser = require('../text-group-parser')
const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')
const processObjectives = require('../process-objectives')

const listNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''

	const attrs = processAttrs(node.content, ['triggers', 'textGroup', 'listStyles'])
	const listStyles = listStylesParser(node.content.listStyles)
	const textGroupXML = textGroupParser(node.content.textGroup)
	const triggersXML = processTriggers(node.content.triggers)
	const objectivesXML = processObjectives(node.content.objectives)
	return `<List${attrs}${id}>` + listStyles + textGroupXML + triggersXML + objectivesXML + `</List>`
}

const listStylesParser = listStyles => {
	if (!listStyles) return ''

	const typeXML = `<type>${listStyles.type}</type>`
	let intentsXML = ''
	if (Array.isArray(listStyles.indents)) {
		listStyles.indents.forEach(indent => {
			const attrs = processAttrs(indent, ['triggers', 'actions'])
			intentsXML += `<indent${attrs} />`
		})
	} else {
		for (const intent in listStyles.indents) {
			let attrs = ` level="${intent}"`
			attrs += processAttrs(listStyles.indents[intent], ['triggers', 'actions'])
			intentsXML += `<indent${attrs} />`
		}
	}

	intentsXML = `<indents>` + intentsXML + `</indents>`

	return `<listStyles>` + typeXML + intentsXML + `</listStyles>`
}

module.exports = listNodeParser
