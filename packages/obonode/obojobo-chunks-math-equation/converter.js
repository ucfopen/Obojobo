import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo Math Equation from a Slate node.
 * Copies the id, type, and triggers.  The conversion also saves the
 * latex, alt, align, label, and size attributes.
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Math Equation node
 */
const slateToObo = node => ({
	id: node.id,
	type: node.type,
	children: [],
	content: withoutUndefined({
		triggers: node.content.triggers,
		objectives: node.content.objectives,
		latex: node.content.latex,
		alt: node.content.alt,
		align: node.content.align,
		label: node.content.label,
		size: node.content.size
	})
})

/**
 * Generates a Slate node from an Obojobo Math Equation.
 * Copies all attributes, and adds a dummy child
 * @param {Object} node An Obojobo Math Equation node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = [{ text: '' }]

	return slateNode
}

export default { slateToObo, oboToSlate }
