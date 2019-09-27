import Common from 'obojobo-document-engine/src/scripts/common'
import constant from './constant'

const { SCORE_RULE_NODE, NUMERIC_FEEDBACK } = constant

const slateToObo = node => {
	const scoreRules = []
	node.nodes.forEach(child => {
		switch (child.type) {
			case SCORE_RULE_NODE:
				const scoreRule = child.data.get('scoreRule')

				child.nodes.forEach(component => {
					if (component.type === NUMERIC_FEEDBACK) {
						const feedback = {
							type: NUMERIC_FEEDBACK,
							children: []
						}

						component.nodes.forEach(c => {
							feedback.children.push(Common.Registry.getItemForType(c.type).slateToObo(c))
						})

						scoreRule.feedback = feedback
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
	const nodes = []
	node.scoreRules.forEach(scoreRule => {
		const node = {
			object: 'block',
			type: SCORE_RULE_NODE,
			nodes: [],
			data: { scoreRule }
		}

		if (scoreRule.feedback) {
			const feedbackNode = {
				object: 'block',
				type: scoreRule.feedback.type,
				nodes: [],
				data: {}
			}

			scoreRule.feedback.children.forEach(child => {
				if (child && child.type == 'ObojoboDraft.Pages.Page')
					feedbackNode.nodes.push(Common.Registry.getItemForType(child.type).oboToSlate(child))
			})

			node.nodes.push(feedbackNode)
		}

		nodes.push(node)
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
