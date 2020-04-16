import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const slateToObo = node => {
	const textGroup = node.nodes.map(line => {
		const textLine = {
			text: { value: line.text, styleList: [] },
			data: {
				indent: line.data.get('indent'),
				hangingIndent: line.data.get('hangingIndent'),
				align: line.data.get('align')
			}
		}

		line.nodes.forEach(text => {
			TextUtil.slateToOboText(text, textLine)
		})

		return textLine
	})

	const content = {
		textGroup
	}

	const nodeContent = node.data.get('content')
	if (nodeContent && nodeContent.triggers) {
		content.triggers = nodeContent.triggers
	}

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: withoutUndefined(content)
	}
}

const oboToSlate = node => {
	const nodes = node.content.textGroup.map(line => {
		const indent = line.data ? line.data.indent : 0
		const hangingIndent = line.data ? line.data.hangingIndent : false
		const align = line.data ? line.data.align : 'left'
		const textLine = {
			object: 'block',
			type: TEXT_LINE_NODE,
			data: { indent, hangingIndent, align },
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
			content: {
				triggers: node.content.triggers
			}
		}
	}
}

export default { slateToObo, oboToSlate }
