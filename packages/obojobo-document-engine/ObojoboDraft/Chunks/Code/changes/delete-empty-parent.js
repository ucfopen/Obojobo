const CODE_NODE = 'ObojoboDraft.Chunks.Code'

const deleteEmptyParent = (event, editor, next) => {
	const last = editor.value.endBlock
	let parent
	editor.value.blocks.forEach(block => {
		parent = editor.value.document.getClosest(block.key, parent => {
			return parent.type === CODE_NODE
		})
	})

	if (last.text === '' && parent.nodes.size === 1) {
		event.preventDefault()
		return editor.removeNodeByKey(parent.key)
	}

	return next()
}

export default deleteEmptyParent
