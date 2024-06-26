import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo Page Node from a Slate node.
 * Copies the id, type, and triggers. It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Page node
 */
const slateToObo = node => ({
	id: node.id,
	type: node.type,
	children: node.children.map(child => Component.helpers.slateToObo(child)),
	content: withoutUndefined({
		triggers: node.content.triggers,
		objectives: node.content.objectives
	})
})

/**
 * Generates a Slate node from an Obojobo Page node.
 * Copies all attributes, and calls the appropriate converters for the children
 * @param {Object} node An Obojobo Page node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = node.children.map(child => Component.helpers.oboToSlate(child))
	return slateNode
}

export default { slateToObo, oboToSlate }
