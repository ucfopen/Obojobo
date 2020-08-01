import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo IFrame from a Slate node.
 * Copies the id, type, and triggers.  The conversion also saves the
 * src, title, type, border, fit, width, height, initalZoom, autoload,
 * and controlls attributes.
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Iframe node
 */
const slateToObo = node => {
	// translate controls from content props to a comma seperated list
	const controls = []
	if (node.content.newWindow) controls.push('new-window')
	if (node.content.reload) controls.push('reload')
	if (node.content.zoom) controls.push('zoom')

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			src: node.content.src,
			title: node.content.title,
			type: node.content.type,
			border: node.content.border,
			fit: node.content.fit,
			width: node.content.width,
			height: node.content.height,
			initialZoom: node.content.initialZoom / 100,
			autoload: node.content.autoload,
			controls: controls.join(',')
		})
	}
}

/**
 * Generates a Slate node from an Obojobo IFrame. Copies all attributes, and adds a dummy child
 * @param {Object} node An Obojobo Iframe node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	const ctrl = slateNode.content.controls || ''
	slateNode.content.newWindow = ctrl.includes('new-window')
	slateNode.content.reload = ctrl.includes('reload')
	slateNode.content.zoom = ctrl.includes('zoom')
	delete slateNode.content.controls
	slateNode.content.initialZoom = slateNode.content.initialZoom * 100
	slateNode.children = [{ text: '' }]
	return slateNode
}

export default { slateToObo, oboToSlate }
