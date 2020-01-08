import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const slateToObo = node => {
	const textGroup = node.children.map(line => {
		const textLine = {
			text: { value: "", styleList: [] },
			data: { indent: line.content.indent, align: line.content.align }
		}

		TextUtil.slateToOboText(line, textLine)

		return textLine
	})

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: {
			textGroup
		}
	}
}

const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = node.content.textGroup.map(line => {
		const indent = line.data ? line.data.indent : 0
		const align = line.data ? line.data.align : 'left'
		return {
			type: TEXT_NODE,
			subtype: TEXT_LINE_NODE,
			content: { indent, align },
			children: TextUtil.parseMarkings(line)
		}
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
