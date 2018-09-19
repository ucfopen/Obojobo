function linkMark(options) {
	const { type, key, render } = options

	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return

			event.preventDefault()

			const value = change.value

			value.marks.forEach(mark => {
				if (mark.type === 'a') {
					change.removeMark({
						type: 'a',
						data: mark.data.toJSON()
					})
				}
			})

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
