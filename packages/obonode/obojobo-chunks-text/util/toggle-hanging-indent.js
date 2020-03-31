import { Editor, Transforms, Range } from 'slate'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const toggleHangingIndent = (entry, editor) => {
	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)

	// Get only the Element children of the current node that are in the current selection
	const list = Array.from(
		Editor.nodes(editor, {
			at: Range.intersection(editor.selection, nodeRange),
			match: child => child.subtype === TEXT_LINE_NODE || child.subtype === LIST_LINE_NODE
		})
	)

	// For each child in the selection, toggle the hanging indent
	for (const [child, path] of list) {
		Transforms.setNodes(
			editor,
			{ content: { ...child.content, hangingIndent: !child.content.hangingIndent } },
			{ at: path }
		)
	}
}

export default toggleHangingIndent
