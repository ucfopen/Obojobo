const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const materiaNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<Materia${attrs}${id}>${triggersXML}</Materia>`
	}

	return `<Materia${attrs}${id} />`
}

module.exports = materiaNodeParser
