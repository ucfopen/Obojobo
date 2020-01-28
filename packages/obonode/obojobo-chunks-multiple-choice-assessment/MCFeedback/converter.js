import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'

/**
 * Generates an Obojobo MCFeedback Node from a Slate node.
 * Copies the id, type, and triggers. It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo MCFeedback node 
 */
const slateToObo = node => ({
	id: node.id,
	type: node.type,
	children: node.children.map(child => Component.helpers.slateToObo(child)),
	content: {
		triggers: node.content.triggers
	}
})

/**
 * Generates a Slate node from an Obojobo MCFeedback node.
 * Copies all attributes, and calls the appropriate converters for the children
 * @param {Object} node An Obojobo MCFeedback node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = node.children.map(child => Component.helpers.oboToSlate(child))
	return slateNode
}

export default { slateToObo, oboToSlate }
