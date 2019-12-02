import { Block } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'


const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha', 'upper-roman']

const flattenLevels = (node, currLevel, textGroup, indents) => {
	const indent = node.data.get('content')

	node.nodes.forEach(child => {
		if (child.type === LIST_LEVEL_NODE) {
			flattenLevels(child, currLevel + 1, textGroup, indents)
			return
		}

		const listLine = {
			text: { value: child.text, styleList: [] },
			data: { indent: currLevel }
		}

		child.nodes.forEach(text => {
			TextUtil.slateToOboText(text, listLine)
		})

		textGroup.push(listLine)
	})

	indents['' + currLevel] = indent
}

const slateToObo = node => {
	const content = node.data.get('content')
	content.textGroup = []
	content.listStyles.indents = []

	node.nodes.forEach(level => {
		flattenLevels(level, 0, content.textGroup, content.listStyles.indents)
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content
	}
}

const validateJSON = json => {
	// Do not consolidate lines
	if (json.type === LIST_LINE_NODE) return json

	// Consolidate levels that are next to each other
	let last = json.nodes[0]
	for (let i = 1; i < json.nodes.length; i++) {
		const next = json.nodes[i]
		if (last.type === LIST_LEVEL_NODE && next.type === LIST_LEVEL_NODE) {
			next.nodes = last.nodes.concat(next.nodes)
			json.nodes[i - 1] = false
		}
		last = next
	}

	// Filter out removed nodes and validate newly combined children
	json.nodes = json.nodes.filter(Boolean).map(node => validateJSON(node))
	return json
}

const oboToSlate = node => {
	const type = node.content.listStyles.type
	const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets

	// make sure that indents exists
	if (!node.content.listStyles.indents) node.content.listStyles.indents = {}

	const nodes = node.content.textGroup.map(line => {
		let indent = line.data ? line.data.indent : 0
		let style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }
		let listLine = {
			object: 'block',
			type: LIST_LEVEL_NODE,
			data: { content: style },
			nodes: [
				{
					object: 'block',
					type: LIST_LINE_NODE,
					nodes: [
						{
							object: 'text',
							leaves: TextUtil.parseMarkings(line)
						}
					]
				}
			]
		}

		while (indent > 0) {
			indent--
			style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }

			listLine = {
				object: 'block',
				type: LIST_LEVEL_NODE,
				data: { content: style },
				nodes: [listLine]
			}
		}

		return listLine
	})

	return validateJSON({
		object: 'block',
		key: node.id,
		type: node.type,
		data: {
			content: node.content
		},
		nodes
	})
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

		// Copy the selected List Line nodes over to the new textNode, 
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
	'ObojoboDraft.Chunks.Code': (editor, node) => {
		const textNode = {
			type: CODE_NODE,
			nodes: []
		}
		const leaves = node.getLeafBlocksAtRange(editor.value.selection)

		// Copy the selected List Line nodes over to the new textNode, 
		// then remove every node except for the first, 
		// as they will be rebuilt in the text node
		// The first node (unremoved) provides an anchor for replacement
		leaves.forEach((child, index) => {
			const jsonNode = child.toJSON()
			jsonNode.type = CODE_LINE_NODE
			jsonNode.data.content = jsonNode.data
			textNode.nodes.push(jsonNode)

			if(index !== 0) editor.removeNodeByKey(child.key)
		})

		// The text node replaces the first child node, with all the copied children,
		// including the copy of the first child
		const block = Block.create(textNode)
		editor.replaceNodeByKey(leaves.get(0).key, block).moveToRangeOfNode(block).focus()
	}
}

export default { slateToObo, oboToSlate, switchType }
