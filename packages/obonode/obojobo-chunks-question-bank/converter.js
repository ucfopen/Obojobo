import Common from 'obojobo-document-engine/src/scripts/common'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

/**
 * Generates an Obojobo QuestionBank Node from a Slate node.
 * Copies the id, type, triggers, and saves the choose and select 
 * attributes from the settings node.  It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo QuestionBank node 
 */
const slateToObo = node => {
	const children = []

	node.children.forEach(child => {
		switch (child.type) {
			case QUESTION_BANK_NODE:
				children.push(slateToObo(child))
				break

			case QUESTION_NODE:
				children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
				break
		}
	})

	return {
		id: node.id,
		type: node.type,
		children,
		content: {
			triggers: node.content.triggers,
			choose: node.content.chooseAll ? Infinity : node.content.choose,
			select: node.content.select
		}
	}
}

/**
 * Generates a Slate node from an Obojobo Question Bank node.
 * Copies all attributes, and calls the appropriate converters for the children
 * It also adds the chooseAll attribute to help display the choose field
 * @param {Object} node An Obojobo Question node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = node.children.map(child => {
		// If the current Node is a registered OboNode, use its custom converter
		if (child.type === QUESTION_BANK_NODE) {
			return oboToSlate(child)
		} else {
			return Common.Registry.getItemForType(child.type).oboToSlate(child)
		}
	})

	slateNode.content.chooseAll = !Number.isFinite(parseInt(node.content.choose, 10))
	if(slateNode.content.chooseAll) slateNode.content.choose = 1
	
	return slateNode
}

export default { slateToObo, oboToSlate }
