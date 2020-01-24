import { Editor, Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const unwrapLevel = (node, editor, event) => {
	event.preventDefault()
	const nodePath = ReactEditor.findPath(editor, node)
	const nodeRange = Editor.range(editor, nodePath)

	Transforms.liftNodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		mode: 'lowest',
		match: child => child.subtype === LIST_LINE_NODE
	})
}

export default unwrapLevel
