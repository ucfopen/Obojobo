function superMark(options) {
	const { type, key, render, modifier } = options

	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return

			event.preventDefault()

			const value = change.value
			const hasScript = value.marks.some(mark => {
				if (mark.type === 'sup') {
					return mark.data.get('num') === modifier
				}
				return false
			})

			if (hasScript) {
				change.removeMark({
					type: 'sup',
					data: { num: modifier }
				})
			} else {
				change.addMark({
					type: 'sup',
					data: { num: modifier }
				})
			}

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

export default superMark
