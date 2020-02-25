import { Editor, Transforms, Range } from 'slate'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const increaseIndent = (entry, editor, event) => {
	event.preventDefault()
	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)

	// Get only the Element children of the current node that are in the current selection
	const list = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		match: child => child.subtype === TEXT_LINE_NODE
	}))

	// For each child in the selection, increment the indent without letting it get above 20
	for(const [child, path] of list){
		Transforms.setNodes(
			editor, 
			{ content: {...child.content, indent: Math.min(child.content.indent + 1, 20)} }, 
			{ at: path }
		)
	}
}

export default increaseIndent
