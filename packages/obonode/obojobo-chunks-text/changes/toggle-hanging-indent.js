const toggleHangingIndent = (event, editor) => {
	event.preventDefault()
	editor.value.blocks.forEach(block => {
		const dataJSON = block.data.toJSON()
		dataJSON.hangingIndent = !dataJSON.hangingIndent
		editor.setNodeByKey(block.key, { data: dataJSON })
	})
	return true
}

export default toggleHangingIndent
