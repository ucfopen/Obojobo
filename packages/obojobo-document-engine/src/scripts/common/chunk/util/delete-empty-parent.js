const deleteEmptyParent = (event, change, nodeType) => {
	const lastBlock = change.value.blocks.slice(-1)[0]
	const parent = change.value.document.getClosest(lastBlock.key, node => node.type === nodeType)

	if (change.value.endBlock.text === '' && parent.nodes.size === 1) {
		event.preventDefault()
		change.removeNodeByKey(parent.key)
		return true
	}
}

export default deleteEmptyParent
