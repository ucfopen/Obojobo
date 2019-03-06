function MarkHotkey(options) {
	const { type, key, render } = options

	return {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return next()

			event.preventDefault()

			return editor.toggleMark(type)
		},
		renderMark(props, editor, next) {
			switch (props.mark.type) {
				case type:
					return render(props)
				default:
					return next()
			}
		}
	}
}

export default MarkHotkey
