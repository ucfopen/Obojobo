import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const slateToObo = node => {
	const textGroup = node.nodes.map(line => {
		const codeLine = {
			text: {
				value: line.text,
				styleList: []
			},
			data: {
				indent: line.data.get('content').indent
			}
		}

		line.nodes.forEach(text => {
			TextUtil.slateToOboText(text, codeLine)
		})

		return codeLine
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

		return codeLine
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
