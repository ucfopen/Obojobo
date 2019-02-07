const increaseIndent = (event, editor) => {
	event.preventDefault()
	editor.value.blocks.forEach(block => {
		let newIndent = block.data.get('content').indent + 1
		if (newIndent > 20) newIndent = 20

		return editor.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default increaseIndent
