import { Block } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

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
	let align
	const nodes = node.content.textGroup.map(line => {
		align = line.data ? line.data.align : 'left'
		return {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}
	})

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content: {
				align,
				level: node.content.headingLevel
			}
		}
	}
}

const switchType = {
	'ObojoboDraft.Chunks.Text': (editor, node) => {
		editor.withoutNormalizing(() => {
			editor.setNodeByKey(node.key, TEXT_LINE_NODE)

			const block = Block.fromJSON({
				object: 'block',
				type: TEXT_NODE
			})
		})
	}
}

export default { slateToObo, oboToSlate, switchType }
