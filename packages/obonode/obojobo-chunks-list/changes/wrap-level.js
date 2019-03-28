const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const wrapLevel = (event, editor) => {
	event.preventDefault()
	return editor.unwrapBlock(LIST_LEVEL_NODE)
}

export default wrapLevel
