import { Editor, Node, Element, Transforms, Text } from 'slate'

import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

// Slate runs normalizations repeatedly on a single node, so each problem can be fixed separtely
// When the normalizeNode function returns, Slate knows that a single problem within the node
// has been fixed, and runs the normalizeNode function again to see if there are any further problems
// For more detailed information, see: https://docs.slatejs.org/concepts/10-normalizing
const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	// If the element is a Code Node, only allow CodeLine children
	if (node.type === CODE_NODE && !node.subtype) {
		// Code child normalization
		for (const [child, childPath] of Node.children(editor, path)) {
			// Unwrap non-CodeLine children
			if (Element.isElement(child) && child.subtype !== CODE_LINE_NODE) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in a CodeLine
			if (Text.isText(child)) {
				Transforms.wrapNodes(
					editor, 
					{
						type: CODE_NODE,
						subtype: CODE_LINE_NODE,
						content: { indent: 0 }
					},
					{ at: childPath }
				)
				return
			}
		}
	}

	// If the element is a CodeLine Node, make sure it has a Code parent
	// and only allow text children
	if (node.type === CODE_NODE && node.subtype === CODE_LINE_NODE) {
		// CodeLine children normalization
		for (const [child, childPath] of Node.children(editor, path)) {
			// Unwrap non-text children
			if (Element.isElement(child)) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}
		}

		// CodeLine parent normalization
		const [parent] = Editor.parent(editor, path)
		if(!Element.isElement(parent) || parent.type !== CODE_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor, 
				entry, 
				{ type: CODE_NODE, children: []}, 
				node => node.subtype === CODE_LINE_NODE
			)
			return
		}
	}

	next(entry, editor)
}

export default normalizeNode
