const HotKeyPlugin = (saveFunction) => {
	// HotKeys are registered on keyup and keydown for cross browser compatability
	return {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey)) return next()

			switch(event.key) {
				case 's':
					event.preventDefault()
					return saveFunction()
				default: 
					return next()
			}
		},
		onKeyUp(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey)) return next()

			switch(event.key) {
				case 's':
					event.preventDefault()
					return saveFunction()
				default: 
					return next()
			}
		}
	}
}

export default HotKeyPlugin
