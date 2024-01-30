import { Node } from 'slate'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo HTML node from a Slate node.
 * Copies the id, type, triggers, and converts text children (including marks)
 * into the html attribute.
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo HTML node
 */
const slateToObo = node => ({
	id: node.id,
	type: node.type,
	children: [],
	content: withoutUndefined({
		triggers: node.content.triggers,
		objectives: node.content.objectives,
		variables: node.content.variables,
		html: Node.string(node)
	})
})

/**
 * Generates a Slate node from an Obojobo HTML node.
 * Copies all attributes, and converts the HTML attribute into Slate Text children
 * @param {Object} node An Obojobo HTML node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)

	slateNode.children = [{ text: node.content.html }]

	return slateNode
}

export default { slateToObo, oboToSlate }
