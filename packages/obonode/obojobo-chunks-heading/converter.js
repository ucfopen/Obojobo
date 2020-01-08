import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const line = {
		text: { value: "", styleList: [] },
		data: { align: node.content.align }
	}
	
	TextUtil.slateToOboText(node, line)

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: {
			headingLevel: node.content.headingLevel,
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
