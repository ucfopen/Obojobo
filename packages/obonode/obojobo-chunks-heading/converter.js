import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const line = {
		text: { value: node.text, styleList: [] },
		data: { align: node.data.get('content').align }
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, line)
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: {
			headingLevel: node.data.get('content').level,
			textGroup: [line]
		}
	}
}

const oboToSlate = node => {
	const slateNode = Object.assign({}, node)

	slateNode.children = node.content.textGroup.flatMap(line => {
		slateNode.content.align = line.data ? line.data.align : 'left'
		return TextUtil.parseMarkings(line)
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
