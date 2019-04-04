const insertTab = (event, editor) => {
	event.preventDefault()
	return editor.insertText('\t')
}

export default insertTab
