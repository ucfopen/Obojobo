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
	deleteEmptyParent: (event, editor, next, nodeType, currentNode) => {
		const firstBlock = currentNode || editor.value.blocks.get(0)

		const parent = editor.value.document.getClosest(firstBlock.key, node => node.type === nodeType)

		if (firstBlock.text === '' && parent.nodes.size === 1) {
			event.preventDefault()
			editor.removeNodeByKey(parent.key)
			return true
		}

		return next()
	}
}

export default KeyDownUtil
