const increaseIndent = (event, change) => {
	event.preventDefault()
	change.value.blocks.forEach(block => {
		const newIndent = Math.min(block.data.get('content').indent + 1, 20)
		if (newIndent > 20) newIndent = 20

		change.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default increaseIndent
