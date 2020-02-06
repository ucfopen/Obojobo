import { Editor, Node, Element, Transforms, Text } from 'slate'

import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

// Slate runs normalizations repeatedly on a single node, so each problem can be fixed separtely
// When the normalizeNode function returns, Slate knows that a single problem within the node
// has been fixed, and runs the normalizeNode function again to see if there are any further problems
// For more detailed information, see: https://docs.slatejs.org/concepts/10-normalizing
const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	// If the element is a Text Node, only allow TextLine children
	if (node.type === TEXT_NODE && !node.subtype) {
		// Text child normalization
		for (const [child, childPath] of Node.children(editor, path)) {
			// Unwrap non-TextLine children
			if (Element.isElement(child) && child.subtype !== TEXT_LINE_NODE) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in a TextLine
			if (Text.isText(child)) {
				Transforms.wrapNodes(
					editor, 
					{
						type: TEXT_NODE,
						subtype: TEXT_LINE_NODE,
						content: { indent: 0 }
					},
					{ at: childPath }
				)
				return
			}
		}
	}

	// If the element is a TextLine Node, make sure it has a Text parent
	// and only allow text and inline children
	if (node.type === TEXT_NODE && node.subtype === TEXT_LINE_NODE) {
		// TextLine children normalization
		for (const [child, childPath] of Node.children(editor, path)) {
			// Unwrap non-text and non-inline children
			if (Element.isElement(child) && !editor.isInline(child)) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}
		}

		// TextLine parent normalization
		const [parent] = Editor.parent(editor, path)
		if(!Element.isElement(parent) || parent.type !== TEXT_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor, 
				entry, 
				{ type: TEXT_NODE, children: []}, 
				node => node.subtype === TEXT_LINE_NODE
			)
			return
		}
	}

	next(entry, editor)
}

export default normalizeNode
