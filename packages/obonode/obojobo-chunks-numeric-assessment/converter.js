const slateToObo = node => ({
	id: node.key,
	type: node.type,
	children: [],
	content: node.data.get('content') || {},
	scoreRules: node.data.get('scoreRules') || []
})

const oboToSlate = node => ({
	object: 'block',
	key: node.id,
	type: node.type,
	nodes: [],
	data: {
		content: node.content,
		scoreRules: node.scoreRules
	}
})

export default { slateToObo, oboToSlate }
