function superMark(options) {
	const { type, key, render, modifier } = options

	return {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return next()

			event.preventDefault()

			const value = editor.value
			const hasScript = value.marks.some(mark => {
				if (mark.type !== 'sup') return false

				return mark.data.get('num') === modifier
			})

			if (hasScript) {
				return editor.removeMark({
					type: 'sup',
					data: { num: modifier }
				})
			} else {
				return editor.addMark({
					type: 'sup',
					data: { num: modifier }
				})
			}
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

export default superMark
