const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const insertText = (event, editor, next) => {
	event.preventDefault()
	const last = editor.value.endBlock

	// Get the deepest level that contains this line
	const listLevel = editor.value.document.getClosest(last.key, par => par.type === LIST_LEVEL_NODE)

	// Double enter on last node
	if (
		editor.value.selection.isCollapsed &&
		last.text === '' &&
		listLevel.nodes.last().key === last.key
	) {
		// Schema will change this back to a list_line unless it is at the end of the list
		return editor.setNodeByKey(last.key, { type: TEXT_NODE })
	}

	return next()
}

export default insertText
