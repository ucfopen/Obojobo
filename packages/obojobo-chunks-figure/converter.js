import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const captionLine = {
		text: { value: node.text, styleList: [] },
		data: null
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, captionLine)
	})

	const content = node.data.get('content')
	content.textGroup = [captionLine]

	return {
		id: node.key,
		type: node.type,
		children: [],
		content
	}
}

const oboToSlate = node => {
	let nodes
	if (!node.content.textGroup) {
		// If there is currently no caption, add one
		nodes = [
			{
				object: 'text',
				leaves: [{ text: '' }]
			}
		]
	} else {
		nodes = node.content.textGroup.map(line => ({
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}))
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
