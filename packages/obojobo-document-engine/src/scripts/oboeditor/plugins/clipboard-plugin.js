import { getEventTransfer } from 'slate-react'

import KeyDownUtil from '../util/keydown-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const ClipboardPlugin = {
	onCopy(event, editor, next) {

	},
	onPaste(event, editor, next) {
		const transfer = getEventTransfer(event)
		// This event allows for reuse of other KeyDown methods
		const dummyEvent = { preventDefault: () => ({})}

		// Pasting in OboEditor nodes
		if(transfer.type === 'fragment'){
			// Save a list of the blocks in the selection
			const saveBlocks = editor.value.blocks
			// Do the standard paste action
			next()
			// Delete empty text nodes in the original selection
			saveBlocks.forEach(node => {
				if(node.text === '') {
					switch(node.type) {
						case TEXT_LINE_NODE:
							return KeyDownUtil.deleteEmptyParent(dummyEvent, editor, editor.delete, TEXT_NODE, node)
					}
				}
			})
			return true
		}

		return next()
	}
}

export default ClipboardPlugin
