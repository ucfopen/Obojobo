import Common from 'obojobo-document-engine/src/scripts/common'

import { NUMERIC_ANSWER_NODE, NUMERIC_FEEDBACK_NODE, NUMERIC_CHOICE_NODE } from './constants'

const slateToObo = node => {
	const numericChoices = []

	// Parse each numericChoice node
	node.nodes.forEach(child => {
		switch (child.type) {
			case NUMERIC_CHOICE_NODE:
				let numericChoice = {}
				child.nodes.forEach(component => {
					if (component.type === NUMERIC_ANSWER_NODE) {
						numericChoice = component.data.get('numericChoice')
					}
					if (component.type === NUMERIC_FEEDBACK_NODE) {
						numericChoice.feedback = Common.Registry.getItemForType(component.type).slateToObo(
							component
						)
					}
				})
				numericChoices.push(numericChoice)

				break
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
				object: 'block',
				type: NUMERIC_CHOICE_NODE,
				nodes: [
					{
						object: 'block',
						type: NUMERIC_ANSWER_NODE,
						data: { numericChoice }
					}
				]
			}

			// Parse feedback node
			if (numericChoice.feedback) {
				const feedbackNode = Common.Registry.getItemForType(numericChoice.feedback.type).oboToSlate(
					numericChoice.feedback
				)

				node.nodes.push(feedbackNode)
			}

			nodes.push(node)
		})
	}

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content: node.content
		}
	}
}

export default { slateToObo, oboToSlate }
