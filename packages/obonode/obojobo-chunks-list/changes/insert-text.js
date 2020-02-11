import { Editor, Transforms, Range, Node } from 'slate'
import { ReactEditor } from 'slate-react'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const insertText = (node, editor, event) => {
	const nodePath = ReactEditor.findPath(editor, node)
	const nodeRange = Editor.range(editor, nodePath)
	const [startLine] = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		match: child => child.subtype === LIST_LINE_NODE
	}))
	const [lineNode, linePath] = startLine

	// If we are deleting multiple things, if the line is not empty, 
	// or if we are not at end of List, stop here
	// Returning before the preventDefault allows Slate to handle the enter
	if (!Range.isCollapsed(editor.selection) || 
		Node.string(lineNode) !== '' ||
		!Editor.isEnd(editor, editor.selection.focus, nodeRange)) return 

	event.preventDefault()

	// Change the listLine into a Text node
	Transforms.setNodes(editor, {
		type: TEXT_NODE,
		content: {},
		subtype: ''
	}, { at: linePath })
}

export default insertText
