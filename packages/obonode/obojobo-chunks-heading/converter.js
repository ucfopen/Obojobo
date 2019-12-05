import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const LIST_NODE = 'ObojoboDraft.Chunks.List'

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
		editor.setNodeByKey(node.key, TEXT_NODE)
	},
	'ObojoboDraft.Chunks.Heading': (editor, node, data) => {
		editor.setNodeByKey(node.key, { data: { content: {...node.data.get('content'), ...data }}})
	},
	'ObojoboDraft.Chunks.Code': (editor, node) => {
		editor.setNodeByKey(node.key, CODE_NODE)
	},
	'ObojoboDraft.Chunks.List': (editor, node, data) => {
		editor.setNodeByKey(node.key, { type: LIST_NODE, data: { content: { listStyles: data }}})
	},
}

export default { slateToObo, oboToSlate, switchType }
