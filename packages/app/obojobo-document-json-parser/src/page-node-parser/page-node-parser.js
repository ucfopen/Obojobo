const processAttrs = require('../process-attrs')

const pageNodeParser = (node, childrenParser) => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, [])

	return `<Page${attrs}${id}>` + childrenParser(node.children) + `</Page>`
}

module.exports = pageNodeParser
