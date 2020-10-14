import { Editor, Range, Transforms } from 'slate'

import looksLikeListItem from '../../obojobo-chunks-list/list-detector'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const convertIfList = function(entry, editor, event) {
	const [node, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)
	const cursor = editor.selection
	const cursorOffset = cursor.anchor.offset
	const nodeIdx = cursor.anchor.path[1]
	const nodeStr = node.children[nodeIdx].children[0].text
	const listPrefix = nodeStr.substring(0, cursorOffset)

	const isList = looksLikeListItem(listPrefix)

	if (isList !== false) {
		const toEndOfLine = {
			anchor: cursor.anchor,
			focus: { ...cursor.anchor, offset: nodeStr.length }
		}

		const toStartOfLine = {
			anchor: cursor.anchor,
			focus: { ...cursor.anchor, offset: 0 }
		}

		event.preventDefault()

		// Delete any text after the cursor to prevent duplicated content
		Transforms.delete(editor, { at: Range.intersection(nodeRange, toEndOfLine) })

		Transforms.insertNodes(
			editor,
			{
				type: LIST_NODE,
				content: { listStyles: { type: isList.type } },
				children: [
					{
						type: LIST_NODE,
						subtype: LIST_LINE_NODE,
						content: {},
						children: [{ text: nodeStr.substring(cursorOffset) }]
					}
				]
			},
			{
				at: cursor,
				select: true
			}
		)

		// Remove the list prefix from the original text node
		Transforms.removeNodes(editor, { at: Range.intersection(nodeRange, toStartOfLine) })

		// Remove original text node if it has no other content in it
		if (node.children.length === 1) {
			Transforms.removeNodes(editor, { at: nodePath })
		}
	}
}

export default convertIfList
