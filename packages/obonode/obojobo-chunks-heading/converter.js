import { Transforms, Editor, Range } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
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

	const newNode = {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
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
	'ObojoboDraft.Chunks.List': (editor, [node, path], data) => {
		const nodeRange = Editor.range(editor, path)
		const [start, end] = Range.edges(editor.selection)
		const containsStart = Range.includes(nodeRange, start) 
		const containsEnd = Range.includes(nodeRange, end)

		const newList = { 
			type: LIST_NODE, 
			subtype: LIST_LEVEL_NODE, 
			content: data,
			children: [
				{ 
					type: LIST_NODE, 
					subtype: LIST_LINE_NODE, 
					content: { hangingIndent: false },
					children: node.children
				}
			]
		}

		Transforms.removeNodes(editor, { at: path })
		Transforms.insertNodes(
			editor,
			newList,
			{ at: path }
		)

		if(containsStart) {
			// Find the final path to the starting line node
			// Because normalization has not yet run, there will be exactly
			// 1 line node for the starting path
			const [startLine] = Editor.nodes(editor, {
				at: path, 
				match: n => n.subtype === LIST_LINE_NODE,
			})
			// The difference between path and start Point indicates what inline
			// and what text leaf is currently selected
			const leafDepth = start.path.length - path.length
			const relativeLeafPath = start.path.slice(start.path.length - leafDepth)

			// Therefore, the point to focus on is 
			// the line's path 
			// + the relative leaf path
			// + the original offset
			Transforms.setPoint(editor, {
				path: startLine[1].concat(relativeLeafPath),
				offset: start.offset
			}, { edge: 'start' })
		}

		if(containsEnd) {
			// Find the final path to the ending line node
			// Because normalization has not yet run, there will be exactly
			// 1 line node for the endinging path
			const [endLine] = Editor.nodes(editor, {
				at: path, 
				match: n => n.subtype === LIST_LINE_NODE,
			})
			// The difference between path and end Point indicates what inline
			// and what text leaf is currently selected
			const leafDepth = end.path.length - path.length
			const relativeLeafPath = end.path.slice(end.path.length - leafDepth)

			// Therefore, the point to focus on is 
			// the line's path 
			// + the relative leaf path
			// + the original offset
			Transforms.setPoint(editor, {
				path: endLine[1].concat(relativeLeafPath),
				offset: end.offset
			}, { edge: 'end' })
		}
	},
}

export default { slateToObo, oboToSlate, switchType }
