import constant from './constant'

const { SCORE_RULE_NODE } = constant

const slateToObo = node => {
	const scoreRules = []
	node.nodes.forEach(child => {
		switch (child.type) {
			case SCORE_RULE_NODE:
				scoreRules.push(child.data.get('scoreRule'))
				break
		}
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: node.data.get('content') || {},
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
