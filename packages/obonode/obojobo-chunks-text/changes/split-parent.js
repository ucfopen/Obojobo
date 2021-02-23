import { Editor, Transforms, Range } from 'slate'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const splitParent = (entry, editor, event) => {
	if (event.isDefaultPrevented()) {
		return
	}

	if (!Range.isCollapsed(editor.selection)) {
		return
	}

	const [leaf] = Editor.leaf(editor, editor.selection)

	if (leaf.text !== '') {
		return
	}

	event.preventDefault()

	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)
	const [[, linePath]] = Array.from(
		Editor.nodes(editor, {
			at: Range.intersection(editor.selection, nodeRange),
			match: child => child.subtype === TEXT_LINE_NODE
		})
	)

	Transforms.splitNodes(editor, { at: linePath, height: 1 })
}

export default splitParent
