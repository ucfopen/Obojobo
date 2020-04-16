const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const toggleHangingIndent = editor => {
	editor.value.blocks.forEach(block => {
		const dataJSON = block.data.toJSON()
		switch (block.type) {
			case LIST_LINE_NODE:
			case TEXT_LINE_NODE:
				dataJSON.hangingIndent = !dataJSON.hangingIndent
				editor.setNodeByKey(block.key, { data: dataJSON })
		}
	})
}

export default toggleHangingIndent
