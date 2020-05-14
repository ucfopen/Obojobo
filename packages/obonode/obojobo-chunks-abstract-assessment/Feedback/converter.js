import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

 // TODO - remove type when viewer is abstracted out
 
/**
 * Generates an Obojobo Feedback Node from a Slate node.
 * Copies the id, type, and triggers. It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Feedback node 
 */
const slateToObo = (node, type) => ({
	id: node.id,
	type,
	children: node.children.map(child => Component.helpers.slateToObo(child)),
	content: withoutUndefined({
		triggers: node.content.triggers
	})
})

/**
 * Generates a Slate node from an Obojobo Feedback node.
 * Copies all attributes, and calls the appropriate converters for the children
 * @param {Object} node An Obojobo Feedback node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.type = 'ObojoboDraft.Chunks.AbstractAssessment.Feedback'
	slateNode.children = node.children.map(child => Component.helpers.oboToSlate(child))
	return slateNode
}

export default { slateToObo, oboToSlate }
