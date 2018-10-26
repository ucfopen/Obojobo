function saveDocument() {
	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== 's') return

			event.preventDefault()
			console.log('saving')
			return true
		}
	}
}

export default saveDocument
