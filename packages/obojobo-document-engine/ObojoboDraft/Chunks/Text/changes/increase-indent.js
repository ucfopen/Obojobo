const increaseIndent = (event, editor) => {
	event.preventDefault()
	editor.value.blocks.forEach(block => {
		const newIndent = Math.min(block.data.get('indent') + 1, 20)

		return editor.setNodeByKey(block.key, {
			data: { indent: newIndent }
		})
	})
	return true
}

export default increaseIndent
