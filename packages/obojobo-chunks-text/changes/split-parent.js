const splitParent = (event, change) => {
	const last = change.value.endBlock
	event.preventDefault()
	change.removeNodeByKey(last.key)
	change.splitBlock(2)
	return true
}

export default splitParent
