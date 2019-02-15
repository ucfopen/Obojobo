const slateToObo = node => ({
	id: node.key,
	type: node.type,
	children: [],
	content: {
		html: node.text
	}
})

const oboToSlate = node => ({
	object: 'block',
	key: node.id,
	type: node.type,
	nodes: [
		{
			object: 'text',
			leaves: [
				{
					text: node.content.html
				}
			]
		}
	]
})

export default { slateToObo, oboToSlate }
