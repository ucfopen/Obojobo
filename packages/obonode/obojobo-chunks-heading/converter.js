import { Transforms } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

/**
 * Generates an Obojobo Heading from a Slate node.
 * Copies the id, type, triggers, and converts text children (including marks)
 * into a textGroup.  The conversion also saves the headingLevel attribute
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Heading node
 */
const slateToObo = node => {
	const line = {
		text: { value: '', styleList: [] },
		data: { align: node.content.align }
	}

	TextUtil.slateToOboText(node, line)

	const newNode = {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			variables: node.content.variables,
			objectives: node.content.objectives,
			headingLevel: node.content.headingLevel,
			textGroup: [line]
		})
	}

	return newNode
}

/**
 * Generates a Slate node from an Obojobo Heading.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * @param {Object} node An Obojobo Heading node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = JSON.parse(JSON.stringify(node))

	slateNode.children = node.content.textGroup.flatMap(line => {
		slateNode.content.align = line.data ? line.data.align : 'left'
		return TextUtil.parseMarkings(line)
	})

	return slateNode
}

const switchType = {
	'ObojoboDraft.Chunks.Text': (editor, [node, path]) => {
		Transforms.setNodes(
			editor,
			{
				type: TEXT_NODE,
				subtype: TEXT_LINE_NODE,
				content: { ...node.content, indent: 0, hangingIndent: false }
			},
			{ at: path }
		)
	},
	'ObojoboDraft.Chunks.Heading': (editor, [node, path], data) => {
		Transforms.setNodes(
			editor,
			{
				content: { ...node.content, ...data }
			},
			{ at: path }
		)
	},
	'ObojoboDraft.Chunks.Code': (editor, [node, path]) => {
		Transforms.setNodes(
			editor,
			{
				type: CODE_NODE,
				subtype: CODE_LINE_NODE,
				content: { ...node.content, indent: 0, hangingIndent: false }
			},
			{ at: path }
		)
	},
	'ObojoboDraft.Chunks.List': (editor, [, path], data) => {
		Transforms.setNodes(
			editor,
			{
				type: LIST_NODE,
				subtype: LIST_LEVEL_NODE,
				content: data
			},
			{ at: path }
		)
	}
}

export default { slateToObo, oboToSlate, switchType }
