import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

/**
 * Generates an Obojobo Figure from a Slate node.
 * Copies the id, type, triggers, and converts text children (including marks)
 * into a textGroup.  The conversion also saves the alt, url, size, width, and
 * height attributes
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Figure node 
 */
const slateToObo = node => {
	const captionLine = {
		text: { value: "", styleList: [] },
		data: null
	}
	TextUtil.slateToOboText(node, captionLine)

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: {
			triggers: node.content.triggers,
			textGroup: [captionLine],
			alt: node.content.alt,
			url: node.content.url,
			size: node.content.size,
			width: node.content.width,
			height: node.content.height
		}
	}
}

/**
 * Generates a Slate node from an Obojobo Figure.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * @param {Object} node An Obojobo Figure node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	if (!node.content.textGroup) {
		// If there is currently no caption, add one
		slateNode.children = [{ text: '' }]
	} else {
		slateNode.children = node.content.textGroup.flatMap(line => TextUtil.parseMarkings(line))
	}

	return slateNode
}

export default { slateToObo, oboToSlate }
