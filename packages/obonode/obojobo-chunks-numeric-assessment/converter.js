import Common from 'obojobo-document-engine/src/scripts/common'

import { NUMERIC_ANSWER_NODE, NUMERIC_FEEDBACK_NODE, NUMERIC_CHOICE_NODE } from './constants'

const slateToObo = node => {
	const numericRules = []

	// Parse each scoreRule node
	node.nodes.forEach(child => {
		switch (child.type) {
			case NUMERIC_CHOICE_NODE:
				let numericRule = {}
				child.nodes.forEach(component => {
					if (component.type === NUMERIC_ANSWER_NODE) {
						numericRule = component.data.get('numericRule')
					}
					if (component.type === NUMERIC_FEEDBACK_NODE) {
						numericRule.feedback = Common.Registry.getItemForType(component.type).slateToObo(
							component
						)
					}
				})
				numericRules.push(numericRule)

				break
		}
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: { numericRules }
	}
}

const oboToSlate = node => {
	// Parse each scoreRule node
	const nodes = node.content.numericRules.map(numericRule => {
		const node = {
			object: 'block',
			type: NUMERIC_CHOICE_NODE,
			nodes: [
				{
					object: 'block',
					type: NUMERIC_ANSWER_NODE,
					data: { numericRule: numericRule }
				}
			]
		}

		// Parse feedback node
		if (numericRule.feedback) {
			const feedbackNode = Common.Registry.getItemForType(numericRule.feedback.type).oboToSlate(
				numericRule.feedback
			)

			node.nodes.push(feedbackNode)
		}

		return node
	})

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
