/* eslint no-alert: 0 */

function linkMark(options) {
	const { type, key, render } = options

	return {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return next()

			event.preventDefault()

			const value = editor.value
			let removedMarks = false

			value.marks.forEach(mark => {
				if (mark.type === 'a') {
					editor.removeMark({
						type: 'a',
						data: mark.data.toJSON()
					})
					removedMarks = true
				}
			})

			if (removedMarks) return false

			const href = window.prompt('Link address:') || null

			return editor.toggleMark({ type, data: { href } })
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

export default linkMark
