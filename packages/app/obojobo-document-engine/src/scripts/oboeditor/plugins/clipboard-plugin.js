import { getEventTransfer } from 'slate-react'
import { Document, Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

const ClipboardPlugin = {
	onPaste(event, editor, next) {
		const transfer = getEventTransfer(event)

		// Pasting in OboEditor nodes
		if (transfer.type === 'fragment') {
			const nodes = []
			transfer.fragment.nodes.forEach(node => {
				const item = Common.Registry.getItemForType(node.type)
				const pastableNode = item.getPasteNode(node)

				if (pastableNode instanceof Block) {
					nodes.push(pastableNode)
				} else {
					pastableNode.forEach(node => nodes.push(node))
				}
			})

			return editor.insertFragment(
				Document.create({ object: 'document', nodes: nodes.map(node => node.toJSON()) })
			)
		}

		return next()
	}
}

export default ClipboardPlugin
