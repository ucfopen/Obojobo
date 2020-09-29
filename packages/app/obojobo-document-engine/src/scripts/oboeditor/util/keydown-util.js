import { Text, Editor, Transforms, Range, Path, Element, Point } from 'slate'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const KeyDownUtil = {
	deleteNodeContents: (event, editor, entry, deleteForward) => {
		const [, nodePath] = entry
		const nodeRange = Editor.range(editor, nodePath)
		// Get only the Element children of the current node that are in the current selection
		const list = Array.from(
			Editor.nodes(editor, {
				at: Range.intersection(editor.selection, nodeRange),
				match: child => Element.isElement(child) && !editor.isInline(child),
				mode: 'lowest'
			})
		)

		// If both ends of the selection are outside the node, simply delete the table
		const [selStart, selEnd] = Range.edges(editor.selection)
		const [nodeStart, nodeEnd] = Range.edges(nodeRange)
		if (Point.isBefore(selStart, nodeStart) && Point.isAfter(selEnd, nodeEnd)) {
			return
		}

		const [, startPath] = list[0]
		const [, endPath] = list[list.length - 1]

		// If a cursor is collapsed, do nothing at start/end based on delete direction
		if (Range.isCollapsed(editor.selection)) {
			if (!deleteForward && editor.selection.anchor.offset === 0) {
				event.preventDefault()
				return
			}
			if (deleteForward && Point.equals(editor.selection.anchor, Editor.end(editor, startPath))) {
				event.preventDefault()
				return
			}
			return
		}

		// Deletion within a single node works as normal
		if (Path.equals(startPath, endPath)) return

		// Deletion across nodes
		event.preventDefault()

		// For each child in the selection, clear the selected text
		for (const [, path] of list) {
			const childRange = Editor.range(editor, path)
			Transforms.delete(editor, { at: Range.intersection(editor.selection, childRange) })
		}

		Transforms.collapse(editor, { edge: deleteForward ? 'end' : 'start' })
	},
	isDeepEmpty(editor, node) {
		if (editor.isVoid(node)) return false
		if (Text.isText(node)) return node.text === ''
		return (
			Editor.isEmpty(editor, node) ||
			(node.children.length === 1 && KeyDownUtil.isDeepEmpty(editor, node.children[0]))
		)
	},
	deleteEmptyParent: (event, editor, [node, path], deleteForward) => {
		// Only delete the node if the selection is collapsed and the node is empty
		if (Range.isCollapsed(editor.selection) && KeyDownUtil.isDeepEmpty(editor, node)) {
			event.preventDefault()
			Transforms.removeNodes(editor, { at: path })

			// By default, the cursor moves to the end of the item before a deleted node
			// after the deletion has occured.  If we are deleting forward, we move it
			// ahead by one, so that it is at the start of the item after the deleted node
			if (deleteForward) Transforms.move(editor)
		}
	},
	breakToText: (event, editor, entry) => {
		const [node, nodePath] = entry
		const nodeRange = Editor.range(editor, nodePath)
		const nodeEnd = Editor.end(editor, nodeRange)
		const selectionEnd = Editor.end(editor, editor.selection)
		const nodeStart = Editor.start(editor, nodeRange)
		const selectionStart = Editor.start(editor, editor.selection)
		const toStartOfNode = {
			anchor: selectionStart,
			focus: nodeStart
		}

		event.preventDefault()

		const toEndOfNode = {
			anchor: selectionEnd,
			focus: nodeEnd
		}

		// If the Range is collapsed at the end of the node, just insert text
		if (Range.isCollapsed(toEndOfNode)) {
			return Transforms.insertNodes(
				editor,
				{
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 0, align: 'left' },
							children: [{ text: '' }]
						}
					]
				},
				{ split: true }
			)
		}

		if (Range.isCollapsed(toStartOfNode)) {
			// Duplicate the node that's being split
			const newNode = { ...node }

			// Insert the duplicate below this node
			Transforms.insertNodes(editor, newNode, { at: toEndOfNode })

			// Transform the duplicated node to a text node
			const nextPath = [...nodePath]
			nextPath[nextPath.length - 1]++
			Transforms.setNodes(editor, { type: TEXT_NODE, content: {} }, { at: nextPath })

			// Move the selection to the start of the duplicated (now text) node
			Transforms.select(editor, nextPath)
			Transforms.collapse(editor, 'start')

			return
		}

		// Set the heading after the selection to text
		Transforms.setNodes(
			editor,
			{
				type: TEXT_NODE,
				content: {}
			},
			{
				at: toEndOfNode,
				split: true
			}
		)
		Transforms.delete(editor, { at: Range.intersection(nodeRange, editor.selection) })
		return Transforms.collapse(editor, { edge: 'end' })
	}
}

export default KeyDownUtil
