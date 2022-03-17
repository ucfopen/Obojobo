import { Editor, Transforms, Range, Path } from 'slate'

import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import SelectionUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/selection-util'
import ListStyles from './list-styles'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

/**
 * Recursively condenses the n-deep structure of a Slate List into
 * a textGroup array and its acompanying indents array.  ListLevels
 * save their styles in the indents array, and ListLines save thier
 * text in the textGroup array
 * @param {Object} node A Slate List Node
 * @param {Integer} currLevel The indent level that is being flattened
 * @param {Array} textGroup The array that the ListLine text will be saved to
 * @param {Array} indents The array that the ListLevel styles will be saved to
 * @returns {Object} An Obojobo List node
 */
const flattenLevels = (node, currLevel, textGroup, indents) => {
	const indent = node.content

	node.children.forEach(child => {
		if (child.subtype === LIST_LEVEL_NODE) {
			flattenLevels(child, currLevel + 1, textGroup, indents)
			return
		}

		const listLine = {
			// text must follow TextUtil's formatting, sytyleList required here
			// but don't confuse it with our list's styleList. NOT for bullet styles
			text: { value: '', styleList: [] },
			data: { indent: currLevel }
		}

		if (child.content && typeof child.content.hangingIndent !== 'undefined') {
			listLine.data.hangingIndent = child.content.hangingIndent
		}

		TextUtil.slateToOboText(child, listLine)

		textGroup.push(listLine)
	})

	indents['' + currLevel] = indent
}

/**
 * Generates an Obojobo List Node from a Slate node.
 * Copies the id, type, triggers, and condenses ListLine children and their
 * text children (including marks) into a single textGroup.  ListLevels are
 * flattened into the listStyles of the Obojobo node
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo List node
 */
const slateToObo = node => {
	const textGroup = []
	const indents = {}

	node.children.forEach(level => {
		flattenLevels(level, 0, textGroup, indents)
	})

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			objectives: node.content.objectives,
			listStyles: {
				type: node.content.listStyles.type,
				indents
			},
			textGroup
		})
	}
}

/**
 * Combines adjacent ListLevel nodes in a Slate List node, at all depths
 * of the List node, to ensure that they display properly in the Visual Editor
 * @param {Object} node An unnormalized Slate List Node
 * @returns {Object} A normlized Slate list node
 */
const normalizeJSON = json => {
	// Do not consolidate lines
	if (json.subtype === LIST_LINE_NODE) return json

	// Consolidate levels that are next to each other
	let last = json.children[0]
	for (let i = 1; i < json.children.length; i++) {
		const next = json.children[i]
		if (last.subtype === LIST_LEVEL_NODE && next.subtype === LIST_LEVEL_NODE) {
			next.children = last.children.concat(next.children)
			json.children[i - 1] = false
		}
		last = next
	}

	// Filter out removed nodes and validate newly combined children
	json.children = json.children.filter(Boolean).map(node => normalizeJSON(node))
	return json
}

/**
 * Generates a Slate node from an Obojobo List node.
 * Copies all attributes, and converts a textGroup into Slate List children
 * Each textItem in the textgroup becomes a separate ListLine, and indents
 * are turned into nested ListLevel parents of the ListLine to properly
 * leverage the Slate Editor's capabilities.  The generated node is then normalized
 * to combine any adjacent ListLevel nodes
 * @param {Object} node An Obojobo Line node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	const type = node.content.listStyles.type
	const bulletList =
		type === ListStyles.TYPE_UNORDERED
			? ListStyles.UNORDERED_LIST_BULLETS
			: ListStyles.ORDERED_LIST_BULLETS

	// Make sure that indents exists
	if (!slateNode.content.listStyles.indents) slateNode.content.listStyles.indents = {}

	slateNode.children = node.content.textGroup.map(line => {
		let indent = line.data && line.data.indent ? parseInt(line.data.indent, 10) : 0
		let style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }
		let listLine = {
			type: LIST_NODE,
			subtype: LIST_LEVEL_NODE,
			content: style,
			children: [
				{
					type: LIST_NODE,
					subtype: LIST_LINE_NODE,
					content: {},
					children: TextUtil.parseMarkings(line)
				}
			]
		}

		if (line.data && typeof line.data.hangingIndent !== 'undefined') {
			listLine.children[0].content.hangingIndent = line.data.hangingIndent
		}

		while (indent > 0) {
			indent--
			style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }

			listLine = {
				type: LIST_NODE,
				subtype: LIST_LEVEL_NODE,
				content: style,
				children: [listLine]
			}
		}

		return listLine
	})

	return normalizeJSON(slateNode)
}

const switchType = {
	'ObojoboDraft.Chunks.Heading': (editor, [, path], data) => {
		const nodeRange = Editor.range(editor, path)
		// Get only the Element children of the current node that are in the current selection
		const list = Array.from(
			Editor.nodes(editor, {
				at: Range.intersection(editor.selection, nodeRange),
				match: child => child.subtype === LIST_LINE_NODE
			})
		)

		Editor.withoutNormalizing(editor, () => {
			list.forEach(([child, childPath]) =>
				Transforms.setNodes(
					editor,
					{ type: HEADING_NODE, content: { ...child.content, ...data }, subtype: null },
					{ at: childPath }
				)
			)
		})
	},
	'ObojoboDraft.Chunks.Text': (editor, [, path]) => {
		const nodeRange = Editor.range(editor, path)
		const [start, end] = Range.edges(editor.selection)
		const containsStart = Range.includes(nodeRange, start)
		const containsEnd = Range.includes(nodeRange, end)

		const textNode = {
			type: TEXT_NODE,
			content: {},
			children: []
		}

		// Get only the Element children of the current node that are in the current selection
		const list = Array.from(
			Editor.nodes(editor, {
				at: Range.intersection(editor.selection, nodeRange),
				match: child => child.subtype === LIST_LINE_NODE
			})
		)

		// Changing each ListLine to a TextLine and wrapping them in a Text node
		// will allow normalization to remove them from the List node
		// Nested levels in the ListLine are transfered into indents
		const startPath = list[0][1]
		let endPath = list[0][1]
		Editor.withoutNormalizing(editor, () => {
			list.forEach(([child, childPath]) => {
				// Save the start and end child paths to fix the selection once all nodes are moved
				if (Path.isAfter(childPath, endPath)) endPath = childPath

				// The difference between the path lengths informs how
				// nested the ListLine is. The -2 accounts for the base
				// ListLevel and the ListLine node itself
				const indent = childPath.length - path.length - 2
				const jsonNode = {
					type: TEXT_NODE,
					subtype: TEXT_LINE_NODE,
					content: {
						...child.content,
						indent,
						align: 'left'
					},
					children: child.children
				}

				textNode.children.push(jsonNode)
			})

			// In order to properly handle the replacement without breaking normalization
			// First delete all text that is going to be replaced
			// This leaves us with an empty ListLine at the start path
			// Then we delete that empty ListLine, and insert the new TextNode in its place
			const initalPoint = Editor.start(editor, startPath)
			const finalPoint = Editor.end(editor, endPath)
			Transforms.delete(editor, {
				at: {
					anchor: initalPoint,
					focus: finalPoint
				}
			})
			Transforms.removeNodes(editor, { at: startPath })
			Transforms.insertNodes(editor, textNode, {
				at: startPath
			})

			if (containsStart) {
				SelectionUtil.resetPointAtUncertainDepth(
					editor,
					path,
					start,
					startPath,
					TEXT_LINE_NODE,
					'anchor'
				)
			}

			if (containsEnd) {
				SelectionUtil.resetPointAtUncertainDepth(
					editor,
					path,
					end,
					endPath,
					TEXT_LINE_NODE,
					'focus'
				)
			}
		})
	},
	'ObojoboDraft.Chunks.Code': (editor, [, path]) => {
		const nodeRange = Editor.range(editor, path)
		const [start, end] = Range.edges(editor.selection)
		const containsStart = Range.includes(nodeRange, start)
		const containsEnd = Range.includes(nodeRange, end)

		const codeNode = {
			type: CODE_NODE,
			content: {},
			children: []
		}

		// Get only the Element children of the current node that are in the current selection
		const list = Array.from(
			Editor.nodes(editor, {
				at: Range.intersection(editor.selection, nodeRange),
				match: child => child.subtype === LIST_LINE_NODE
			})
		)

		// Changing each ListLine to a CodeLine and wrapping them in a Code node
		// will allow normalization to remove them from the List node
		// Nested levels in the ListLine are transfered into indents
		const startPath = list[0][1]
		let endPath = list[0][1]
		Editor.withoutNormalizing(editor, () => {
			list.forEach(([child, childPath]) => {
				// Save the start and end child paths to fix the selection once all nodes are moved
				if (Path.isAfter(childPath, endPath)) endPath = childPath

				// The difference between the path lengths informs how
				// nested the ListLine is. The -2 accounts for the base
				// ListLevel and the ListLine node itself
				const indent = childPath.length - path.length - 2
				const jsonNode = {
					type: CODE_NODE,
					subtype: CODE_LINE_NODE,
					content: {
						...child.content,
						indent,
						align: 'left'
					},
					children: child.children
				}

				codeNode.children.push(jsonNode)
			})

			// In order to properly handle the replacement without breaking normalization
			// First delete all text that is going to be replaced
			// This leaves us with an empty ListLine at the start path
			// Then we delete that empty ListLine, and insert the new CodeNode in its place
			const initalPoint = Editor.start(editor, startPath)
			const finalPoint = Editor.end(editor, endPath)
			Transforms.delete(editor, {
				at: {
					anchor: initalPoint,
					focus: finalPoint
				}
			})
			Transforms.removeNodes(editor, { at: startPath })
			Transforms.insertNodes(editor, codeNode, {
				at: startPath
			})

			if (containsStart) {
				SelectionUtil.resetPointAtUncertainDepth(
					editor,
					path,
					start,
					startPath,
					CODE_LINE_NODE,
					'anchor'
				)
			}

			if (containsEnd) {
				SelectionUtil.resetPointAtUncertainDepth(
					editor,
					path,
					end,
					endPath,
					CODE_LINE_NODE,
					'focus'
				)
			}
		})
	},
	'ObojoboDraft.Chunks.List': (editor, [node, path], data) => {
		const nodeRange = Editor.range(editor, path)
		const swapType = data.type !== node.content.listStyles.type

		// If we are toggling between ordered and unordered lists
		// Then we need to change the type on the root node
		if (swapType) {
			Transforms.setNodes(editor, { content: { ...node.content, listStyles: data } }, { at: path })
		}

		// Find the bullet list and starting index for the selection
		const bulletList =
			data.type === ListStyles.TYPE_UNORDERED
				? ListStyles.UNORDERED_LIST_BULLETS
				: ListStyles.ORDERED_LIST_BULLETS
		const bulletIndex = bulletList.indexOf(data.bulletStyle)

		// Get only the Element children of the current node that are in the current selection
		const list = Array.from(
			Editor.nodes(editor, {
				at: Range.intersection(editor.selection, nodeRange),
				match: child => child.subtype === LIST_LINE_NODE
			})
		)

		const shortestPath = list.reduce((accum, [, childPath]) => {
			if (childPath.length < accum) return childPath.length
			return accum
		}, Infinity)

		list.forEach(([child, childPath]) => {
			childPath.forEach((value, index) => {
				// No changes are needed on the ListLine itself
				if (index === childPath.length - 1) return

				// If we are not swapping the list type, we don't want to change
				// any bullets that are not visibly selected. The visibly selected
				// ListLevels can be found by comparing the pathlength to the
				// shortestPath. The -2 accounts for the base List and the
				// ListLine node itself
				if (!swapType && index < shortestPath - 2) return

				// If we are swapping the list type, we want to make sure to not
				// overwrite the List content
				if (swapType && index === 0) return

				const linePath = childPath.slice(0, index + 1)
				const bulletStyle =
					bulletList[
						// Start the selected bullet type on the least nested nodes that are visibly selected
						// and then rotate through the bulet styles for any other levels of nesting
						// other visibly delected nodes will progress down through the bulletStyles
						// If we are switching types, nested levels that are not visibly selected will
						// move backwards through the bulletStyles list
						(bulletIndex + index - shortestPath + 2 + bulletList.length) % bulletList.length
					]

				Transforms.setNodes(
					editor,
					{ content: { ...child.content, ...data, bulletStyle } },
					{ at: linePath }
				)
			})
		})
	}
}

export default { slateToObo, oboToSlate, switchType }
