import Common from 'obojobo-document-engine/src/scripts/common'
import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
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
		triggers: node.content.triggers,
		objectives: node.content.objectives,
		type: node.content.type,
		revealAnswer: node.content.revealAnswer
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

			case NUMERIC_ASSESSMENT_NODE:
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
		content: withoutUndefined(content)
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
	const clonedNode = JSON.parse(JSON.stringify(node))

	clonedNode.children = clonedNode.children.map(child => {
		if (child.type === MCASSESSMENT_NODE || child.type === NUMERIC_ASSESSMENT_NODE) {
			return Common.Registry.getItemForType(child.type).oboToSlate(child)
		} else {
			return Component.helpers.oboToSlate(child)
		}
	})

	if (clonedNode.content.solution) {
		const solution = {
			type: QUESTION_NODE,
			subtype: SOLUTION_NODE,
			children: [Common.Registry.getItemForType(PAGE_NODE).oboToSlate(clonedNode.content.solution)]
		}
		clonedNode.children.push(solution)
	}

	return clonedNode
}

export default { slateToObo, oboToSlate }
