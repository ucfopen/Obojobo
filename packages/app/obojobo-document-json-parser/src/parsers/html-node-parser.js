const processAttrs = require('../process-attrs')

const htmlNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, [])

	return `<HTML${attrs}${id} />`
}

module.exports = htmlNodeParser
