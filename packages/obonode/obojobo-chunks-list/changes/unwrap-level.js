import { Editor, Transforms, Range } from 'slate'

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const unwrapLevel = (entry, editor, event) => {
	event.preventDefault()
	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)

	Transforms.liftNodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		mode: 'lowest',
		match: child => child.subtype === LIST_LINE_NODE
	})
}

export default unwrapLevel
