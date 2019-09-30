import Common from 'obojobo-document-engine/src/scripts/common'

import { SCORE_RULE_NODE, NUMERIC_FEEDBACK } from './constant'

const slateToObo = node => {
	const scoreRules = []

	node.nodes.forEach(child => {
		switch (child.type) {
			case SCORE_RULE_NODE:
				const scoreRule = child.data.get('scoreRule')

				child.nodes.forEach(component => {
					if (component.type === NUMERIC_FEEDBACK) {
						scoreRule.feedback = {
							type: 'NumericFeedback',
							children: component.nodes.map(c =>
								Common.Registry.getItemForType(c.type).slateToObo(c)
							)
						}
					}
				})

				scoreRules.push(scoreRule)
				break
		}
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		scoreRules
	}
}

const oboToSlate = node => {
	const nodes = node.scoreRules.map(scoreRule => {
		const node = {
			object: 'block',
			type: SCORE_RULE_NODE,
			nodes: [
				{
					object: 'block',
					type: NUMERIC_FEEDBACK,
					nodes: scoreRule.feedback.children.map(child =>
						Common.Registry.getItemForType(child.type).oboToSlate(child)
					),
					data: {}
				}
			],
			data: { scoreRule }
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
