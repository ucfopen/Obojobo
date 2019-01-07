const decreaseIndent = (event, change) => {
	event.preventDefault()
	change.value.blocks.forEach(block => {
		let newIndent = block.data.get('content').indent - 1
		if (newIndent < 1) newIndent = 0

		return change.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default decreaseIndent
