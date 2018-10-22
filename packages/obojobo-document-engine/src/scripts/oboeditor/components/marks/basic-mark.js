function MarkHotkey(options) {
	const { type, key, render } = options

	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return

			event.preventDefault()

			change.toggleMark(type)
			return true
		},
		renderMark(props) {
			switch (props.mark.type) {
				case type:
					return render(props)
			}
		}
	}
}

export default MarkHotkey
