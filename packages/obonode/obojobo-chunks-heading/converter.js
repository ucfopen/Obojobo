import { Block } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

/**
 * Generates an Obojobo Heading from a Slate node.
 * Copies the id, type, triggers, and converts text children (including marks)
 * into a textGroup.  The conversion also saves the headingLevel attribute
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Heading node 
 */
const slateToObo = node => {
	const line = {
		text: { value: "", styleList: [] },
		data: { align: node.content.align }
	}
	
	TextUtil.slateToOboText(node, line)

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			headingLevel: node.content.headingLevel,
			textGroup: [line]
		})
	}
}

/**
 * Generates a Slate node from an Obojobo Heading.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * @param {Object} node An Obojobo Heading node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)

	slateNode.children = node.content.textGroup.flatMap(line => {
		slateNode.content.align = line.data ? line.data.align : 'left'
		return TextUtil.parseMarkings(line)
	})

	return slateNode
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
		const json = node.toJSON()
		const newList = Block.create({ 
			type: LIST_NODE, 
			data: { content: { listStyles: data }},
			nodes: [
				{ 
					type: LIST_LEVEL_NODE, 
					data: { content: data },
					object: 'block',
					nodes: [
						{ 
							type: LIST_LINE_NODE, 
							object: 'block',
							nodes: json.nodes
						}
					]
				}
			]
		})

		editor.replaceNodeByKey(node.key, newList).moveToRangeOfNode(newList).focus()
	},
}

export default { slateToObo, oboToSlate, switchType }
