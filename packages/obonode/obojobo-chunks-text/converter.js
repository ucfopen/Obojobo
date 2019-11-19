import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const LIST_NODE = 'ObojoboDraft.Chunks.List'

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
	const nodes = node.content.textGroup.map(line => {
		const indent = line.data ? line.data.indent : 0
		const align = line.data ? line.data.align : 'left'
		const textLine = {
			object: 'block',
			type: TEXT_LINE_NODE,
			data: { indent, align },
			nodes: [
				{
					object: 'text',
					leaves: TextUtil.parseMarkings(line)
				}
			]
		}

		return textLine
	})

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content: {}
		}
	}
}

const switchType = {
	'ObojoboDraft.Chunks.Heading': (level, node) => {
		console.log(node, level)
	}
}

export default { slateToObo, oboToSlate, switchType }
