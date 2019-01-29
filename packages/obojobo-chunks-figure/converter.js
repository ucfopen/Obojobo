import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')

	json.content.textGroup = []
	const captionLine = {
		text: { value: node.text, styleList: [] },
		data: null
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, captionLine)
	})

	json.content.textGroup.push(captionLine)
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	json.nodes = []
	// If there is currently no caption, add one
	if (!node.content.textGroup) {
		const caption = {
			object: 'text',
			leaves: [
				{
					text: ''
				}
			]
		}
		json.nodes.push(caption)
		return json
	}

	node.content.textGroup.forEach(line => {
		const caption = {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}

		json.nodes.push(caption)
	})

	return json
}

export default { slateToObo, oboToSlate }
