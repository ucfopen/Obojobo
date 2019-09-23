const slateToObo = node => {
	const children = []
	const content = node.data.get('content') || {}
	delete content.solution

	return {
		id: node.key,
		type: node.type,
		children,
		content
	}
}

const oboToSlate = node => {
	const nodes = []
	const content = node.content

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content
		}
	}
}

export default { slateToObo, oboToSlate }
