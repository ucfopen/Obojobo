import { Editor, Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const splitParent = (node, editor, event) => {
	const [leaf] = Editor.leaf(editor, editor.selection)

	// If the last node was not empty, continue as normal
	if(!Range.isCollapsed(editor.selection) || leaf.text !== '') return

	event.preventDefault()

	const nodePath = ReactEditor.findPath(editor, node)
	const nodeRange = Editor.range(editor, nodePath)
	const [[,linePath]] = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		match: child => child.subtype === TEXT_LINE_NODE
	}))

	Transforms.splitNodes(editor, { at: linePath, height: 1 })
}

export default splitParent
