import Common from 'obojobo-document-engine/src/scripts/common'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

// TODO - remove type when viewer is abstracted out
import { FEEDBACK_NODE, CHOICE_NODE } from '../constants'
const MC_CHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MC_FEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
const NUMERIC_FEEDBACK_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback'

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
	children: node.children.map(child => {
		const feedbackType = type === MC_CHOICE_NODE ? MC_FEEDBACK_NODE : NUMERIC_FEEDBACK_NODE
		return Common.Registry.getItemForType(child.type).slateToObo(child, feedbackType)
	}),
	content: withoutUndefined({
		triggers: node.content.triggers,
		score: node.content.score
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
	slateNode.type = CHOICE_NODE
	if (node.children.length > 1) node.children[1].type = FEEDBACK_NODE
	slateNode.children = node.children.map(child =>
		Common.Registry.getItemForType(child.type).oboToSlate(child)
	)
	return slateNode
}

export default { slateToObo, oboToSlate }
