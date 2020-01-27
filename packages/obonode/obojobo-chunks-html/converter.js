import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const slateToObo = node => {
	const content = {
		html: node.text
	}

	const nodeContent = node.data.get('content')
	if (nodeContent && nodeContent.triggers) {
		content.triggers = nodeContent.triggers
	}

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: withoutUndefined(content)
	}
}

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
	],
	data: {
		content: {
			triggers: node.content.triggers
		}
	}
})

export default { slateToObo, oboToSlate }
