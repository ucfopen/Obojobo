import Common from 'obojobo-document-engine/src/scripts/common'

import { NUMERIC_ANSWER_NODE, NUMERIC_FEEDBACK_NODE, NUMERIC_CHOICE_NODE } from './constants'

const slateToObo = node => {
	const numericChoices = []

	// Parse each numericChoice node
	node.children.forEach(numericChoiceNode => {
		if (numericChoiceNode.type !== NUMERIC_CHOICE_NODE) {
			return
		}

		const choiceChildNodes = numericChoiceNode.children.filter(
			child => child.type === NUMERIC_ANSWER_NODE || child.type === NUMERIC_FEEDBACK_NODE
		)

		const [answer, feedback] = choiceChildNodes

		if (feedback) {
			numericChoices.push({
				...answer.content.numericChoice,
				feedback: Common.Registry.getItemForType(feedback.type).slateToObo(feedback)
			})
		} else {
			numericChoices.push({ ...answer.content.numericChoice })
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
				type: NUMERIC_CHOICE_NODE,
				children: [
					{
						type: NUMERIC_ANSWER_NODE,
						content: { numericChoice },
						children: [{ text: '' }]
					}
				]
			}

			// Parse feedback node
			if (numericChoice.feedback) {
				const feedbackNode = Common.Registry.getItemForType(numericChoice.feedback.type).oboToSlate(
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
