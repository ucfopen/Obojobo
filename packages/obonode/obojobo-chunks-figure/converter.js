import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo Figure from a Slate node.
 * Copies the id, type, triggers, and converts text children (including marks)
 * into a textGroup.  The conversion also saves the alt, url, size, width, and
 * height attributes
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Figure node
 */
const slateToObo = node => {
	const figureText = {
		text: { value: '', styleList: [] },
		data: null
	}
	TextUtil.slateToOboText(node, figureText)

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			textGroup: [figureText],
			alt: node.content.alt,
			url: node.content.url,
			size: node.content.size,
			width: node.content.width,
			height: node.content.height,
			captionWidth: node.content.captionWidth,
			wrapText: node.content.wrapText,
			captionText: node.content.captionText,
			float: node.content.float
		})
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
