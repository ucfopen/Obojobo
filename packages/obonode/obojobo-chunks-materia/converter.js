import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo IFrame from a Slate node.
 * Copies the id, type, and triggers.  The conversion also saves the
 * src, title, type, border, fit, width, height, initalZoom, autoload,
 * and controlls attributes.
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Iframe node
 */
const slateToObo = node => ({
	id: node.id,
	type: node.type,
	children: [],
	content: withoutUndefined({
		triggers: node.content.triggers,
		src: node.content.src,
		title: node.content.title,
		type: node.content.type,
		widgetEngine: node.content.widgetEngine,
		icon: node.content.icon,
		border: node.content.border,
		fit: node.content.fit,
		width: node.content.width,
		height: node.content.height,
		initialZoom: node.content.initialZoom,
		autoload: node.content.autoload,
		controls: node.content.controls
	})
})


/**
 * Generates a Slate node from an Obojobo IFrame. Copies all attributes, and adds a dummy child
 * @param {Object} node An Obojobo Iframe node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = [{ text: '' }]

	return slateNode
}

export default { slateToObo, oboToSlate }
