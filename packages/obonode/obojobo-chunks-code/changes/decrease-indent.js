import { Editor, Path, Element, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

const decreaseIndent = (node, editor, event) => {
	event.preventDefault()
	// Get only the Element children of the current node that are in the current selection
	const list = Editor.nodes(editor, {
		match: child => {
			const nodePath = ReactEditor.findPath(editor, node)
			const childPath = ReactEditor.findPath(editor, child)
			return Element.isElement(child) && Path.isAncestor(nodePath, childPath)
		}
	})

	for(const [child, path] of list){
		Transforms.setNodes(
			editor, 
			{ content: {...child.content, indent: Math.max(child.content.indent - 1, 0)} }, 
			{ at: path }
		)
	}
}

export default decreaseIndent
