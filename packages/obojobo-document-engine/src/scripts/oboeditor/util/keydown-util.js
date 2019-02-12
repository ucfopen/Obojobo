const KeyDownUtil = {
	deleteNodeContents: (event, change) => {
		const value = change.value
		const selection = value.selection
		const startBlock = value.startBlock
		const startOffset = selection.start.offset
		const isCollapsed = selection.isCollapsed
		const endBlock = value.endBlock

		// If a cursor is collapsed at the start of the first block, do nothing
		if (startOffset === 0 && isCollapsed) {
			event.preventDefault()
			return change
		}

		// Deletion within a cell
		if (startBlock === endBlock) {
			return
		}

		// Deletion across cells
		event.preventDefault()
		const blocks = value.blocks

		// Get all cells that contains the selection
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
				change.removeNodeByKey(node.key)
			})
		})

		return true
	},
	deleteEmptyParent: (event, change, nodeType) => {
		const firstBlock = change.value.blocks.get(0)

		const parent = change.value.document.getClosest(firstBlock.key, node => node.type === nodeType)

		if (change.value.endBlock.text === '' && parent.nodes.size === 1) {
			event.preventDefault()
			change.removeNodeByKey(parent.key)
			return true
		}
	}
}

export default KeyDownUtil
