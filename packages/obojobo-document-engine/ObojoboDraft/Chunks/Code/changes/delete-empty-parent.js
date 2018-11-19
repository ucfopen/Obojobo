const CODE_NODE = 'ObojoboDraft.Chunks.Code'

const deleteEmptyParent = (event, change) => {
	const last = change.value.endBlock
	let parent
	change.value.blocks.forEach(block => {
		parent = change.value.document.getClosest(block.key, parent => {
			return parent.type === CODE_NODE
		})
	})

	if (last.text === '' && parent.nodes.size === 1) {
		event.preventDefault()
		change.removeNodeByKey(parent.key)
		return true
	}
}

export default deleteEmptyParent
