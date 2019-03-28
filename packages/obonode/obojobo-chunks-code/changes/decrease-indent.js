const decreaseIndent = (event, editor) => {
	event.preventDefault()
	editor.value.blocks.forEach(block => {
		const newIndent = Math.max(block.data.get('content').indent - 1, 0)

		return editor.setNodeByKey(block.key, {
			data: { content: { indent: newIndent } }
		})
	})
	return true
}

export default decreaseIndent
