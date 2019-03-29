const splitParent = (event, editor) => {
	const last = editor.value.endBlock
	event.preventDefault()
	return editor.removeNodeByKey(last.key).splitBlock(2)
}

export default splitParent
