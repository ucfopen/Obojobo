const decreaseIndent = (event, change) => {
	event.preventDefault()
	change.value.blocks.forEach(block => {
		const newIndent = Math.max(block.data.get('content').indent - 1, 0)

		change.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default decreaseIndent
