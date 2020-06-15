import Common from 'obojobo-document-engine/src/scripts/common'

import { NUMERIC_ANSWER_NODE, NUMERIC_CHOICE_NODE, NUMERIC_FEEDBACK_NODE } from './constants'

const CHOICE_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Choice'
const FEEDBACK_NODE = 'ObojoboDraft.Chunks.AbstractAssessment.Feedback'

// TODO - refactor converter when viewer is abstracted

const slateToObo = node => {
	const numericChoices = []

	// Parse each numericChoice node
	node.children.forEach(numericChoiceNode => {
		const [answer, feedback] = numericChoiceNode.children

		if (feedback) {
			numericChoices.push({
				...answer.content,
				...numericChoiceNode.content,
				feedback: Common.Registry.getItemForType(feedback.type).slateToObo(
					feedback,
					NUMERIC_FEEDBACK_NODE
				)
			})
		} else {
			numericChoices.push({ ...answer.content, ...numericChoiceNode.content })
		}
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: { numericChoices }
	}
}

const oboToSlate = node => {
	const nodes = []

	// Parse each numericChoice node
	if (node.content && node.content.numericChoices) {
		node.content.numericChoices.forEach(numericChoice => {
			const node = {
				type: CHOICE_NODE,
				content: { score: numericChoice.score },
				children: [
					{
						type: NUMERIC_ANSWER_NODE,
						content: { ...numericChoice },
						children: [{ text: '' }]
					}
				]
			}

			// Parse feedback node
			if (numericChoice.feedback) {
				const feedbackNode = Common.Registry.getItemForType(FEEDBACK_NODE).oboToSlate(
					numericChoice.feedback
				)

				node.children.push(feedbackNode)
			}

			nodes.push(node)
		})
	}

	return {
		type: node.type,
		children: nodes,
		content: node.content
	}
}

export default { slateToObo, oboToSlate }
