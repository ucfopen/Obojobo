import Common from 'obojobo-document-engine/src/scripts/common'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

 // TODO - remove type when viewer is abstracted out

/**
 * Generates an Obojobo Choice Node from a Slate node.
 * Copies the id, type, and triggers. It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Choice node 
 */
const slateToObo = (node, type) => ({
	id: node.id,
	type,
	children: node.children.map(child => Common.Registry.getItemForType(child.type).slateToObo(child)),
	content: withoutUndefined({
		triggers: node.content.triggers,
		score: node.content. score
	})
})

/**
 * Generates a Slate node from an Obojobo Choice node.
 * Copies all attributes, and calls the appropriate converters for the children
 * @param {Object} node An Obojobo Choice node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.type = 'ObojoboDraft.Chunks.AbstractAssessment.Choice'
	slateNode.children = node.children.map(child => Common.Registry.getItemForType(child.type).oboToSlate(child))
	return slateNode
}

export default { slateToObo, oboToSlate }
