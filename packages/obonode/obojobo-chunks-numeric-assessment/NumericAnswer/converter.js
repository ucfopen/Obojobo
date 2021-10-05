import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo MCChoice Node from a Slate node.
 * Copies the id, type, and triggers. It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo MCChoice node
 */
const slateToObo = node => {
	const content = withoutUndefined({
		triggers: node.content.triggers,
		score: node.content.score
	})

	switch (node.content.requirement) {
		case 'range':
			content.requirement = 'range'
			content.start = node.content.start
			content.end = node.content.end
			break

		case 'margin':
			content.requirement = 'margin'
			content.answer = node.content.answer
			content.margin = node.content.margin
			content.type = node.content.type
			break

		case 'exact':
		default:
			content.requirement = 'exact'
			content.answer = node.content.answer
			break
	}

	return {
		id: node.id,
		type: node.type,
		children: [],
		content
	}
}

/**
 * Generates a Slate node from an Obojobo MCChoice node.
 * Copies all attributes, and calls the appropriate converters for the children
 * @param {Object} node An Obojobo MCChoice node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = [{ text: '' }]
	return slateNode
}

export default { slateToObo, oboToSlate }
