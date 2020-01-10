import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const slateToObo = node => {
	const textGroup = node.children.map(line => {
		const textLine = {
			text: { value: "", styleList: [] },
			data: { indent: line.content.indent }
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
		return {
			type: CODE_NODE,
			subtype: CODE_LINE_NODE,
			content: { indent },
			children: TextUtil.parseMarkings(line)
		}
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
