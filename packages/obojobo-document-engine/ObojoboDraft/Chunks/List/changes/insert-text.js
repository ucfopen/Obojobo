const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const insertText = (event, change) => {
	event.preventDefault()
	const last = change.value.endBlock

	// Get the deepest level that contains this line
	const listLevel = change.value.document.getClosest(last.key, par => {
		return par.type === LIST_LEVEL_NODE
	})

	// Double enter on last node
	if (
		change.value.selection.isCollapsed &&
		last.text === '' &&
		listLevel.nodes.last().key === last.key
	) {
		// Schema will change this back to a list_line unless it is at the end of the list
		change.setNodeByKey(last.key, { type: TEXT_NODE })
		return true
	}
}

export default insertText
