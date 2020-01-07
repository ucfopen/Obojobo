import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const slateToObo = node => {
	const textGroup = node.nodes.map(line => {
		const textLine = {
			text: { value: line.text, styleList: [] },
			data: { indent: line.data.get('indent'), align: line.data.get('align') }
		}

		line.nodes.forEach(text => {
			TextUtil.slateToOboText(text, textLine)
		})

		return textLine
	})

	return {
		id: node.key,
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
