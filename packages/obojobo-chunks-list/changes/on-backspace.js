const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const onBackspace = (event, change) => {
	const last = change.value.endBlock

	// If the block is not empty or we are deleting multiple things, delete normally
	if (!change.value.selection.isCollapsed || last.text !== '') return

	// Get the deepest level that contains this line
	const listLevel = change.value.document.getClosest(last.key, par => {
		return par.type === LIST_LEVEL_NODE
	})

	// levels with more than one child should delete normally
	if (listLevel.nodes.size > 1) return

	// Get the deepest level that holds the listLevel
	const oneLevelUp = change.value.document.getClosest(listLevel.key, par => {
		return par.type === LIST_LEVEL_NODE
	})

	// If it is a nested item, move it up one layer
	if (oneLevelUp) {
		event.preventDefault()
		change.unwrapNodeByKey(last.key)
		return true
	}

	// If it is at the top level of an empty list, delete the whole list
	const parent = change.value.document.getClosest(last.key, par => {
		return par.type === LIST_NODE
	})

	event.preventDefault()
	change.removeNodeByKey(parent.key)
	return true
}

export default onBackspace
