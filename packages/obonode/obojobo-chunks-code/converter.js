import { Block } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha', 'upper-roman']

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
			content: {}
		}
	}
}

// Provides a single node with recursively nested parent levels with appropriate bullets
const unFlattenList = (jsonNode, diff, type, bulletList, bulletIndex) => {
	if(diff === 0) return jsonNode

	// The parent bullet style is the style before the current style
	const bulletStyle = bulletList[(bulletIndex + diff - 1) % bulletList.length]

	return unFlattenList({
		object: 'block',
		type: LIST_LEVEL_NODE,
		nodes: [jsonNode],
		data: { content: { type,  bulletStyle }}
	}, diff - 1, type, bulletList, bulletIndex)
}

const switchType = {
	'ObojoboDraft.Chunks.Heading': (editor, node, data) => {
		node
			.getLeafBlocksAtRange(editor.value.selection)
			.forEach(child => editor.setNodeByKey(
				child.key, 
				{ type: HEADING_NODE, data: { content: { ...child.data.toJSON(), ...data } }}
			))
	},
	'ObojoboDraft.Chunks.Text': (editor, node) => {
		const textNode = {
			type: TEXT_NODE,
			nodes: []
		}
		const leaves = node.getLeafBlocksAtRange(editor.value.selection)

		// Copy the selected Code Line nodes over to the new textNode, 
		// then remove every node except for the first, 
		// as they will be rebuilt in the text node
		// The first node (unremoved) provides an anchor for replacement
		leaves.forEach((child, index) => {
			const jsonNode = child.toJSON()
			jsonNode.type = TEXT_LINE_NODE
			textNode.nodes.push(jsonNode)

			if(index !== 0) editor.removeNodeByKey(child.key)
		})

		// The text node replaces the first child node, with all the copied children,
		// including the copy of the first child
		const block = Block.create(textNode)
		editor.replaceNodeByKey(leaves.get(0).key, block).moveToRangeOfNode(block).focus()
	},
	'ObojoboDraft.Chunks.List': (editor, node, data) => {
		// Find the bullet list ind starting index for the selection
		const bulletList = data.type === 'unordered' ? unorderedBullets : orderedBullets
		const bulletIndex = bulletList.indexOf(data.bulletStyle)

		const textNode = {
			type: LIST_NODE,
			nodes: [],
			data: { content: { listStyles: { type: data.type }}}
		}
		const leaves = node.getLeafBlocksAtRange(editor.value.selection)

		const topIndent = leaves.reduce((accum, child) => {
			const jsonNode = child.toJSON()
			if (jsonNode.data.indent < accum) return jsonNode.data.indent
			return accum
		}, 20)

		// Copy the selected code Line nodes over to the new list Node,
		// then remove every node except for the first, 
		// as they will be rebuilt in the list node
		// The first node (unremoved) provides an anchor for replacement
		leaves.forEach((child, index) => {
			const jsonNode = child.toJSON()
			jsonNode.type = LIST_LEVEL_NODE

			// Use the topmost indent as the starting bullet style
			// then rotate through the bullet styles as the indents increase
			const indentDiff = jsonNode.data.indent - topIndent
			const bulletStyle = bulletList[(bulletIndex + indentDiff) % bulletList.length]
			jsonNode.data.content = { ...data, bulletStyle }
			textNode.nodes.push(unFlattenList(jsonNode, indentDiff, data.type, bulletList, bulletIndex))

			if(index !== 0) editor.removeNodeByKey(child.key)
		})

		// The list node replaces the first child node, with all the copied children,
		// including the copy of the first child
		const block = Block.create(textNode)
		editor.replaceNodeByKey(leaves.get(0).key, block).moveToRangeOfNode(block).focus()
	}
}

export default { slateToObo, oboToSlate, switchType }
