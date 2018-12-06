const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const deleteEmptyParent = (event, change) => {
	const last = change.value.endBlock
	let parent
	change.value.blocks.forEach(block => {
		parent = change.value.document.getClosest(block.key, parent => {
			return parent.type === TEXT_NODE
		})
	})

	if (last.text === '' && parent.nodes.size === 1) {
		event.preventDefault()
		change.removeNodeByKey(parent.key)
		return true
	}
}

export default deleteEmptyParent
