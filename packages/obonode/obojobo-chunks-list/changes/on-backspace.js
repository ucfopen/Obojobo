import { Editor, Transforms, Range, Node } from 'slate'

const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const onBackspace = (entry, editor, event) => {
	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)
	const [startLine] = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		match: child => child.subtype === LIST_LINE_NODE
	}))
	const [lineNode, linePath] = startLine

	// If we are deleting multiple things or the line is not empty, stop here
	// Returning before the preventDefault allows Slate to handle the delete
	if (!Range.isCollapsed(editor.selection) || Node.string(lineNode) !== '') {
		return 
	}

	// Get the deepest level that contains this line
	const [listLevel, levelPath] = Editor.parent(editor, linePath)
	if (listLevel.children.length > 1) return

	event.preventDefault()

	// Get the deepest level that holds the listLevel
	const [oneLevelUp, oneLevelUpPath] = Editor.parent(editor, levelPath)
	if (oneLevelUp.subtype === LIST_LEVEL_NODE) {
		Transforms.liftNodes(editor, { at: linePath })
	} else {
		Transforms.removeNodes(editor, { at: oneLevelUpPath })
	}
}

export default onBackspace
