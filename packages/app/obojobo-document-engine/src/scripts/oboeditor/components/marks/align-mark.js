const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

function alignMark(options) {
	const { align, key } = options

	return {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return next()

			event.preventDefault()

			const value = editor.value

			value.blocks.forEach(block => {
				const dataJSON = block.data.toJSON()
				if (block.type === TEXT_LINE_NODE) {
					dataJSON.align = align
				} else {
					dataJSON.content.align = align
				}

				editor.setNodeByKey(block.key, { data: dataJSON })
			})
		}
	}
}

export default alignMark
