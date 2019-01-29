const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const wrapLevel = (event, change) => {
	event.preventDefault()
	change.unwrapBlock(LIST_LEVEL_NODE)
	return true
}

export default wrapLevel
