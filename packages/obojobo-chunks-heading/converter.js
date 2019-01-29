import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	json.content.headingLevel = node.data.get('content').level
	json.content.textGroup = []

	const line = {
		text: { value: node.text, styleList: [] },
		data: { align: node.data.get('content').align }
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, line)
	})

	json.content.textGroup.push(line)
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }
	json.data.content.level = node.content.headingLevel

	json.nodes = []
	node.content.textGroup.forEach(line => {
		json.data.content.align = line.data ? line.data.align : 'left'
		const headingline = {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}

		json.nodes.push(headingline)
	})

	return json
}

export default { slateToObo, oboToSlate }
