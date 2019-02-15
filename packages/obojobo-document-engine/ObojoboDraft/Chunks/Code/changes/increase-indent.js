const increaseIndent = (event, editor) => {
	event.preventDefault()
	editor.value.blocks.forEach(block => {
		const newIndent = Math.min(block.data.get('content').indent + 1, 20)

		return editor.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default increaseIndent
