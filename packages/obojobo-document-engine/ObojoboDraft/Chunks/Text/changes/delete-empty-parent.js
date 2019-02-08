const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const deleteEmptyParent = (event, editor, next) => {
	const last = editor.value.endBlock
	let parent
	editor.value.blocks.forEach(block => {
		parent = editor.value.document.getClosest(block.key, parent => {
			return parent.type === TEXT_NODE
		})
	})

	if (last.text === '' && parent.nodes.size === 1) {
		event.preventDefault()
		return editor.removeNodeByKey(parent.key)
	}

	next()
}

export default deleteEmptyParent
