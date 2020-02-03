import { Text, Editor, Transforms, Range, Path, Element, Point } from 'slate'
import { ReactEditor } from 'slate-react'

const KeyDownUtil = {
	deleteNodeContents: (event, editor, node, deleteForward) => {
		const nodePath = ReactEditor.findPath(editor, node)
		const nodeRange = Editor.range(editor, nodePath)
		// Get only the Element children of the current node that are in the current selection
		const list = Array.from(Editor.nodes(editor, {
			at: Range.intersection(editor.selection, nodeRange),
			match: child => {
				const childPath = ReactEditor.findPath(editor, child)
				return Element.isElement(child) && Path.isAncestor(nodePath, childPath)
			},
			mode: 'lowest'
		}))

		// If both ends of the selection are outside the table, simply delete the table
		const [selStart, selEnd] = Range.edges(editor.selection)
		const [nodeStart, nodeEnd] = Range.edges(nodeRange)
		if(Point.isBefore(selStart, nodeStart) && Point.isAfter(selEnd, nodeEnd)) {
			return
		}


		const [,startPath] = list[0]
		const [,endPath] = list[list.length - 1]

		// If a cursor is collapsed, do nothing at start/end based on delete direction
		if (Range.isCollapsed(editor.selection)) {
			if(!deleteForward && editor.selection.anchor.offset === 0){
				event.preventDefault()
				return
			}
			if(deleteForward && Point.equals(editor.selection.anchor, Editor.end(editor, startPath))){
				event.preventDefault()
				return
			}	
		}

		// Deletion within a single node works as normal
		if (Path.equals(startPath, endPath)) return

		// Deletion across nodes
		event.preventDefault()

		// For each child in the selection, clear the selected text
		for(const [, path] of list){
			const childRange = Editor.range(editor, path)
			Transforms.delete(
				editor, 
				{ at: Range.intersection(editor.selection, childRange) }
			)
		}

		Transforms.collapse(editor, { edge: deleteForward ? 'end' : 'start' })
	},
	isDeepEmpty(editor, node) {
		if(editor.isVoid(node)) return false
		if(Text.isText(node)) return node.text === ''
		return  Editor.isEmpty(editor, node) || (node.children.length === 1 && KeyDownUtil.isDeepEmpty(editor, node.children[0]))
	},
	deleteEmptyParent: (event, editor, node, deleteForward) => {
		// Only delete the node if the selection is collapsed and the node is empty
		if(Range.isCollapsed(editor.selection) && KeyDownUtil.isDeepEmpty(editor, node)) {
			event.preventDefault()
			const path = ReactEditor.findPath(editor, node)
			Transforms.removeNodes(editor, { at: path })

			// By default, the cursor moves to the end of the item before a deleted node
			// after the deletion has occured.  If we are deleting forward, we move it
			// ahead by one, so that it is at the start of the item after the deleted node
			if(deleteForward) Transforms.move(editor)
		}
	}
}

export default KeyDownUtil
