import { Editor, Transforms, Range, Node } from 'slate'

const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const onBackspace = (entry, editor, event) => {
	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)
	const [startLine] = Array.from(
		Editor.nodes(editor, {
			at: Range.intersection(editor.selection, nodeRange),
			match: child => child.subtype === LIST_LINE_NODE
		})
	)
	const [lineNode, linePath] = startLine
	const cursor = editor.selection
	const cursorOffset = cursor.anchor.offset
	const nodeStr = Node.string(lineNode)

	// If we are deleting multiple things or we are not at the start of the line, stop here
	// Returning before the preventDefault allows Slate to handle the delete
	if (!Range.isCollapsed(editor.selection) || cursorOffset !== 0) {
		return
	}

	// Get the deepest level that contains this line
	const [listLevel, levelPath] = Editor.parent(editor, linePath)
	// Get the deepest level that holds the listLevel
	const [oneLevelUp, oneLevelUpPath] = Editor.parent(editor, levelPath)
	if (oneLevelUp.subtype === LIST_LEVEL_NODE) {
		// If we are not at the highest level, lift the current node
		Transforms.liftNodes(editor, { at: linePath })
	} else if (linePath[nodePath.length + 1] === 0) {
		// Else if we are at the first item in the list, remove it
		// If it has children remove the line, otherwise remove the whole node
		const deletePath = listLevel.children.length > 1 ? linePath : oneLevelUpPath
		Transforms.removeNodes(editor, { at: deletePath })

		const isFirstNode = !Editor.before(editor, editor.selection.anchor)
		const isLastNode = !Editor.after(editor, editor.selection.anchor)

		Transforms.insertNodes(
			editor,
			{
				type: TEXT_NODE,
				children: [
					{
						type: TEXT_NODE,
						subtype: TEXT_LINE_NODE,
						content: { align: 0, indent: 0, hangingIndent: false },
						children: [{ text: nodeStr }]
					}
				]
			},
			{ at: deletePath }
		)

		// If the list was the only node on the page, an empty text node is created after removing it
		// Merge them to remove the extra blank node
		if (isFirstNode && isLastNode) {
			Transforms.mergeNodes(editor, editor.selection.anchor)
		}

		const selectPath = isFirstNode
			? Editor.before(editor, editor.selection.anchor)
			: Editor.after(editor, editor.selection.anchor)
		Transforms.select(editor, { ...selectPath, offset: 0 })
	} else {
		// If not at first item in the list, do not preventDefault and let Slate handle the delete
		return
	}

	event.preventDefault()
}

export default onBackspace
