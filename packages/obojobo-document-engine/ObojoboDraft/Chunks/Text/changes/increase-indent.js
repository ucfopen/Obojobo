const increaseIndent = (event, change) => {
	event.preventDefault()
	change.value.blocks.forEach(block => {
		const newIndent = Math.min(block.data.get('indent') + 1, 20)

		change.setNodeByKey(block.key, {
			data: { indent: newIndent }
		})
	})
	return true
}

export default increaseIndent
