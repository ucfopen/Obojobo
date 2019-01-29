const increaseIndent = (event, change) => {
	event.preventDefault()
	change.value.blocks.forEach(block => {
		let newIndent = block.data.get('content').indent + 1
		if (newIndent > 20) newIndent = 20

		return change.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default increaseIndent
