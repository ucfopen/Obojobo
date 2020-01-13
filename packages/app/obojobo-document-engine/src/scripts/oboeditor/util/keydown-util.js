import { Text, Editor, Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'

const KeyDownUtil = {
	deleteNodeContents: (event, editor, next) => {
		const value = editor.value
		const selection = value.selection
		const startBlock = value.startBlock
		const startOffset = selection.start.offset
		const isCollapsed = selection.isCollapsed
		const endBlock = value.endBlock

		// If a cursor is collapsed at the start of the first block, do nothing
		if (startOffset === 0 && isCollapsed) {
			event.preventDefault()
			return editor
		}

		// Deletion within a single node
		if (startBlock === endBlock) {
			return next()
		}

		// Deletion across nodes
		event.preventDefault()
		const blocks = value.blocks

		// Get all nodes that contain the selection
		const cells = blocks.toSet()

		const ignoreFirstCell = value.selection.moveToStart().start.isAtEndOfNode(cells.first())
		const ignoreLastCell = value.selection.moveToEnd().end.isAtStartOfNode(cells.last())

		let cellsToClear = cells
		if (ignoreFirstCell) {
			cellsToClear = cellsToClear.rest()
		}
		if (ignoreLastCell) {
			cellsToClear = cellsToClear.butLast()
		}

		// Clear all the selection
		cellsToClear.forEach(cell => {
			cell.nodes.forEach(node => {
				editor.removeNodeByKey(node.key)
			})
		})

		return editor
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
			Transforms.removeNodes(editor, { at: path, hanging: true })

			// By default, the cursor moves to the end of the item before a deleted node
			// after the deletion has occured.  If we are deleting forward, we move it
			// ahead by one, so that it is at the start of the item after the deleted node
			if(deleteForward) Transforms.move(editor)
		}
	}
}

export default KeyDownUtil
