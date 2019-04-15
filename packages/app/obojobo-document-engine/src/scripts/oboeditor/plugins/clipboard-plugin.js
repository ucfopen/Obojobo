import { getEventTransfer } from 'slate-react'
import Common from 'Common'

import KeyDownUtil from '../util/keydown-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const ClipboardPlugin = {
	onPaste(event, editor, next) {
		const transfer = getEventTransfer(event)
		// This event allows for reuse of other KeyDown methods without breaking
		// the default onPaste behavior
		const dummyEvent = { preventDefault: () => ({}) }

		// Pasting in OboEditor nodes
		if (transfer.type === 'fragment') {
			// Save a list of the blocks in the selection
			const saveBlocks = editor.value.blocks

			// Find if any parent nodes that onPaste is inserting into supports
			// children
			const firstBlock = saveBlocks.get(0)
			const ancestors = editor.value.document.getAncestors(firstBlock.key)
			const supportsChildren = ancestors.some(block => {
				const registerModel = Common.Registry.getItemForType(block.type)
				if (!registerModel) return false
				return registerModel.supportsChildren
			})

			// If pasting into OboNodes that support children, insert only the
			// leaf-most oboeditor.component nodes
			if (supportsChildren) {
				editor.getComponents(transfer.fragment, true).forEach(block => editor.insertBlock(block))

			// If pasting into OboNodes that do not support children, paste
			// the root-most components
			} else {
				editor.getComponents(transfer.fragment, false).forEach(block => editor.insertBlock(block))
			}

			// Delete empty text nodes in the original selection
			saveBlocks.forEach(node => {
				if (node.text === '') {
					switch (node.type) {
						case TEXT_LINE_NODE:
							return KeyDownUtil.deleteEmptyParent(
								dummyEvent,
								editor,
								editor.delete,
								TEXT_NODE,
								node
							)
					}
				}
			})
			return true
		}

		return next()
	},
	queries: {
		// Gets the oboeditor.component nodes that are closest to the leaves in
		// the given fragment
		// O(number of leaf nodes)
		getComponents(editor, fragment, leafmost) {
			// Get all leaf nodes in fragment
			const blocks = fragment.getBlocks()

			// Get the oboeditor.components that are the closest ancestor to the leaf nodes
			// This will contain duplicates, as each leaf node will return their parent, and
			// some leaves may share the same oboeditor.component (Text, Code, List, etc.)
			const components = blocks.map(node => {
				if(leafmost) return fragment.getClosest(node.key, parent => parent.type === 'oboeditor.component')

				return fragment.getFurthest(node.key, parent => parent.type === 'oboeditor.component')
			})

			// Remove duplicate parents based on keys - Duplicates will always be adjacent
			return components
				.map((component, i) => {
					const nextNode = components.get(i + 1)
					if (nextNode && nextNode.key === component.key) {
						return false
					}
					return component
				})
				.filter(Boolean)
		}
	}
}

export default ClipboardPlugin
