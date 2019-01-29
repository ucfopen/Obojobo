import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}

	json.content.textGroup = []
	node.nodes.forEach(line => {
		const codeLine = {
			text: { value: line.text, styleList: [] },
			data: { indent: line.data.get('content').indent }
		}

		line.nodes.forEach(text => {
			TextUtil.slateToOboText(text, codeLine)
		})

		json.content.textGroup.push(codeLine)
	})
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }

	json.nodes = []
	node.content.textGroup.forEach(line => {
		const indent = line.data ? line.data.indent : 0
		const codeLine = {
			object: 'block',
			type: CODE_LINE_NODE,
			data: { content: { indent } },
			nodes: [
				{
					object: 'text',
					leaves: TextUtil.parseMarkings(line)
				}
			]
		}

		json.nodes.push(codeLine)
	})

	return json
}

export default { slateToObo, oboToSlate }
