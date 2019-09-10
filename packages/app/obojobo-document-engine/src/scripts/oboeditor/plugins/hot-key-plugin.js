const HotKeyPlugin = (saveFunction) => {
	// HotKeys are registered on keyup and keydown for cross browser compatability
	const onKeyPress = (event, editor, next) => {
		if (!(event.ctrlKey || event.metaKey)) return next()

		switch(event.key) {
			case 's':
				event.preventDefault()
				return saveFunction()
			case 'z':
				event.preventDefault()
				return editor.undo()
			case 'y':
				event.preventDefault()
				return editor.redo()
			case 'a': 
				event.preventDefault()
				return editor.moveToRangeOfDocument().focus()
			default: 
				return next()
		}
	}

	return {
		onKeyDown(event, editor, next) {
			return onKeyPress(event, editor, next)
		},
		onKeyUp(event, editor, next) {
			return onKeyPress(event, editor, next)
		}
	}
}

export default HotKeyPlugin
