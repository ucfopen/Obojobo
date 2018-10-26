function moveFocus(options) {
	const {startKey, endKey} = options

	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== startKey) return

			event.preventDefault()
			console.log('movingFocus')
			return true
		}
	}
}

export default moveFocus
