import { Editor, Transforms, Element, Path, Range } from 'slate'
import { ReactEditor } from 'slate-react'

const splitParent = (node, editor, event) => {
	const [leaf] = Editor.leaf(editor, editor.selection)

	// If the last node was not empty, continue as normal
	if(!Range.isCollapsed(editor.selection) || leaf.text !== '') return

	event.preventDefault()

	const nodePath = ReactEditor.findPath(editor, node)
	const nodeRange = Editor.range(editor, nodePath)
	const [[,linePath]] = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		match: child => {
			const childPath = ReactEditor.findPath(editor, child)
			return Element.isElement(child) && Path.isAncestor(nodePath, childPath)
		}
	}))

	Transforms.splitNodes(editor, { at: linePath, height: 1 })
}

export default splitParent
