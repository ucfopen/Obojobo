import Common from 'obojobo-document-engine/src/scripts/common'
import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

/**
 * Generates an Obojobo Question Node from a Slate node.
 * Copies the id, type, triggers, and creates a new solution attribute
 * if the Question has a Solution child.  It also calls the appropriate
 * slateToObo methods for each of its child components
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Question node 
 */
const slateToObo = node => {
	const children = []
	const content = {
		triggers: node.triggers,
		type: node.type
	}

	node.children.forEach(child => {
		switch (child.type) {
			// Handles Solution nodes - 
			case QUESTION_NODE:
				content.solution = Common.Registry.getItemForType(PAGE_NODE).slateToObo(child.children[0])
				break

			case MCASSESSMENT_NODE:
				children.push(Common.Registry.getItemForType(child.type).slateToObo(child))
				break

			default:
				children.push(Component.helpers.slateToObo(child))
				break
		}
	})

	return {
		id: node.id,
		type: node.type,
		children,
		content
	}
}

/**
 * Generates a Slate node from an Obojobo Question node.
 * Copies all attributes, and calls the appropriate converters for the children
 * It also converts the content.solution data into a child of the question
 * @param {Object} node An Obojobo Question node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = node.children.map(child => {
		if (child.type === MCASSESSMENT_NODE) {
			return Common.Registry.getItemForType(child.type).oboToSlate(child)
		} else {
			return Component.helpers.oboToSlate(child)
		}
	})

	if (node.content.solution) {
		const solution = {
			type: QUESTION_NODE,
			subtype: SOLUTION_NODE,
			children: [Common.Registry.getItemForType(PAGE_NODE).oboToSlate(node.content.solution)]
		}
		slateNode.children.push(solution)
	}

	return slateNode
}

export default { slateToObo, oboToSlate }
