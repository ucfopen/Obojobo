import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'
import IFrameSizingTypes from './iframe-sizing-types'

/**
 * Generates an Obojobo IFrame from a Slate node.
 * Copies the id, type, and triggers.  The conversion also saves the
 * src, title, type, border, fit, width, height, initalZoom, autoload,
 * and controlls attributes.
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Iframe node
 */

const slateToObo = node => {
	const oboNode = {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			objectives: node.content.objectives,
			variables: node.content.variables,
			src: node.content.src,
			title: node.content.title,
			type: node.content.type,
			border: node.content.border,
			fit: node.content.fit,
			height: node.content.height,
			initialZoom: node.content.initialZoom,
			autoload: node.content.autoload,
			controls: node.content.controls,
			sizing: node.content.sizing
		})
	}

	// If an iframe is converted to XML or JSON with the max-width or text-width
	// setting, the width attribute should be non-existant.
	if (
		node.content.sizing === IFrameSizingTypes.TEXT_WIDTH ||
		node.content.sizing === IFrameSizingTypes.MAX_WIDTH
	) {
		return oboNode
	}

	return { ...oboNode, content: { ...oboNode.content, width: node.content.width } }
}

/**
 * Generates a Slate node from an Obojobo IFrame. Copies all attributes, and adds a dummy child
 * @param {Object} node An Obojobo Iframe node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = [{ text: '' }]

	if (
		slateNode.content.sizing === IFrameSizingTypes.TEXT_WIDTH ||
		slateNode.content.sizing === IFrameSizingTypes.MAX_WIDTH
	) {
		slateNode.content.width = 640
	}

	return slateNode
}

export default { slateToObo, oboToSlate }
