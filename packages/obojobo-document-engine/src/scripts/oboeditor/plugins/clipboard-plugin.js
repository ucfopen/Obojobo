import { Block } from 'slate'
import { getEventTransfer } from 'slate-react'

const ClipboardPlugin = {
	onCopy(event, editor, next) {
		next()

		const transfer = getEventTransfer(event)
		console.log(transfer)
		console.log(transfer.fragment.toJSON())
	},
	onPaste(event, editor, next) {
		const transfer = getEventTransfer(event)

		// delete all node contents w/o deleteing the node

		// If any of the current nodes is empty delete it before inserting


		next()
	}
}

export default ClipboardPlugin
