const decreaseIndent = (event, change) => {
	event.preventDefault()
	change.value.blocks.forEach(block => {
		let newIndent = block.data.get('indent') - 1
		if (newIndent < 1) newIndent = 0

		change.setNodeByKey(block.key, {
			data: { indent: newIndent }
		})
	})
	return true
}

export default decreaseIndent
