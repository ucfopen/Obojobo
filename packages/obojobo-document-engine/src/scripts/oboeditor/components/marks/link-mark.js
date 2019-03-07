/* eslint no-alert: 0 */

function linkMark(options) {
	const { type, key, render } = options

	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return

			event.preventDefault()

			const value = change.value
			let removedMarks = false

			value.marks.forEach(mark => {
				if (mark.type === 'a') {
					change.removeMark({
						type: 'a',
						data: mark.data.toJSON()
					})
					removedMarks = true
				}
			})

			if (removedMarks) return false

			const href = window.prompt('Link address:') || null

			change.toggleMark({ type, data: { href } })
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

export default linkMark
