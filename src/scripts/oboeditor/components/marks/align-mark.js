const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

function alignMark(options) {
	const { align, key } = options

	return {
		onKeyDown(event, change) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== key) return

			event.preventDefault()

			const value = change.value

			value.blocks.forEach(block => {
				const dataJSON = block.data.toJSON()
				if (block.type === TEXT_LINE_NODE) {
					dataJSON.align = align
				} else {
					dataJSON.content.align = align
				}

				change.setNodeByKey(block.key, { data: dataJSON })
			})
			return true
		}
	}
}

export default alignMark
