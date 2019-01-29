const insertTab = (event, change) => {
	event.preventDefault()
	change.insertText('\t')
	return true
}

export default insertTab
