import { Editor, Path, Element, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

const increaseIndent = (node, editor, event) => {
	event.preventDefault()

	// Get only the Element children of the current node that are in the current selection
	const list = Editor.nodes(editor, {
		match: child => {
			const nodePath = ReactEditor.findPath(editor, node)
			const childPath = ReactEditor.findPath(editor, child)
			return Element.isElement(child) && Path.isAncestor(nodePath, childPath)
		}
	})

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
