const processAttrs = require('../process-attrs')
const processTriggers = require('../process-triggers')

const mathEquationNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, ['triggers', 'actions'])
	const triggersXML = processTriggers(node.content.triggers)

	if (triggersXML) {
		return `<MathEquation${attrs}${id}>${triggersXML}</MathEquation>`
	}

	return `<MathEquation${attrs}${id} />`
}

module.exports = mathEquationNodeParser
