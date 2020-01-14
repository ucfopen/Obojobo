/**
 * Generates an Obojobo Break from a Slate node.
 * Copies the id, type, and content.width
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Break node 
 */
const slateToObo = node => ({
	id: node.id,
	type: node.type,
	children: [],
	content: {
		width: node.content.width
	}
})

/**
 * Generates a Slate node from an Obojobo Break. Copies all attributes, and adds a dummy child
 * The conversion also ensures that the Slate node has a width so it will display properly
 * @param {Object} node An Obojobo Break node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = [{ text: '' }]

	if (!slateNode.content.width) slateNode.content.width = 'normal'

	return slateNode
}

export default { slateToObo, oboToSlate }
