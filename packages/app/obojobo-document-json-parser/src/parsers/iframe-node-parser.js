const processAttrs = require('../process-attrs')

const iFrameNodeParser = node => {
	const id = node.id ? ` id="${node.id}"` : ''
	const attrs = processAttrs(node.content, [])

	return `<IFrame${attrs}${id} />`
}

module.exports = iFrameNodeParser
