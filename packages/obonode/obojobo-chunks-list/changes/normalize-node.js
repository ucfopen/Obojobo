import { Editor, Node, Element, Transforms, Text } from 'slate'

import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
import ListStyles from '../list-styles'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

// Slate runs normalizations repeatedly on a single node, so each problem can be fixed separtely
// When the normalizeNode function returns, Slate knows that a single problem within the node
// has been fixed, and runs the normalizeNode function again to see if there are any further problems
// For more detailed information, see: https://docs.slatejs.org/concepts/10-normalizing
const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	// If the element is a List Node, only allow ListLevel children
	if (node.type === LIST_NODE && !node.subtype) {
		// List child normalization
		let prev
		for (const [child, childPath] of Node.children(editor, path)) {
			// Merge consecutive ListLevels
			if (prev && prev.subtype === LIST_LEVEL_NODE && child.subtype === LIST_LEVEL_NODE) {
				Transforms.mergeNodes(editor, { at: childPath })
				return
			}

			// Wrap loose ListLine children
			if (Element.isElement(child) && child.subtype === LIST_LINE_NODE) {
				const bulletList =
					node.content.listStyles.type === ListStyles.TYPE_UNORDERED
						? ListStyles.UNORDERED_LIST_BULLETS
						: ListStyles.ORDERED_LIST_BULLETS
				const bulletStyle = bulletList[0]

				Transforms.wrapNodes(
					editor,
					{
						type: LIST_NODE,
						subtype: LIST_LEVEL_NODE,
						content: { type: node.content.listStyles.type, bulletStyle }
					},
					{ at: childPath }
				)
				return
			}

			// Unwrap non-ListLevel and ListLine children
			if (
				Element.isElement(child) &&
				!(child.subtype === LIST_LEVEL_NODE || child.subtype === LIST_LINE_NODE)
			) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in a CodeLine
			if (Text.isText(child)) {
				Transforms.wrapNodes(
					editor,
					{
						type: LIST_NODE,
						subtype: LIST_LEVEL_NODE,
						content: { indent: 0 }
					},
					{ at: childPath }
				)
				return
			}

			// If we got here, no normalizations occured in this node
			// We know this is a safe node, so we should save it to check against
			// its next sibling
			prev = child
		}
	}

	// If the element is a ListLevel Node, make sure it has a List parent
	// and only allow ListLevel and ListLine children
	if (node.type === LIST_NODE && node.subtype === LIST_LEVEL_NODE) {
		// ListLevel children normalization
		let prev
		for (const [child, childPath] of Node.children(editor, path)) {
			// Merge consecutive ListLevels
			if (prev && prev.subtype === LIST_LEVEL_NODE && child.subtype === LIST_LEVEL_NODE) {
				Transforms.mergeNodes(editor, { at: childPath })
				return
			}

			// Maintain list type integrity between levels
			if (child.subtype === LIST_LEVEL_NODE && child.content.type !== node.content.type) {
				const bulletList =
					node.content.type === ListStyles.TYPE_UNORDERED
						? ListStyles.UNORDERED_LIST_BULLETS
						: ListStyles.ORDERED_LIST_BULLETS
				const bulletStyle =
					bulletList[(bulletList.indexOf(node.content.bulletStyle) + 1) % bulletList.length]

				Transforms.setNodes(
					editor,
					{ content: { ...child.content, type: node.content.type, bulletStyle } },
					{ at: childPath }
				)
			}

			// Unwrap non-ListLine children
			if (
				Element.isElement(child) &&
				!(child.subtype === LIST_LEVEL_NODE || child.subtype === LIST_LINE_NODE)
			) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in a CodeLine
			if (Text.isText(child)) {
				Transforms.wrapNodes(
					editor,
					{
						type: LIST_NODE,
						subtype: LIST_LINE_NODE,
						content: {}
					},
					{ at: childPath }
				)
				return
			}

			// If we got here, no normalizations occured in this node
			// We know this is a safe node, so we should save it to check against
			// its next sibling
			prev = child
		}

		// ListLevel parent normalization
		const [parent] = Editor.parent(editor, path)
		if (!Element.isElement(parent) || parent.type !== LIST_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor,
				entry,
				{
					type: LIST_NODE,
					content: {
						listStyles: { type: node.content.type }
					},
					children: []
				},
				node => node.subtype === LIST_LEVEL_NODE
			)
			return
		}
	}

	// If the element is a ListLine Node, make sure it has a List parent
	// and only allow Text and inline children
	if (node.type === LIST_NODE && node.subtype === LIST_LINE_NODE) {
		// ListLine children normalization
		for (const [child, childPath] of Node.children(editor, path)) {
			// Unwrap non-Text and inline children
			if (Element.isElement(child) && !editor.isInline(child)) {
				Transforms.liftNodes(editor, { at: childPath })
				return
			}
		}

		// ListLine parent normalization
		// Note - orphaned ListLines are wrapped in a parent List, and then
		// wrapped in a List Level on a subsequent normalization run
		const [parent] = Editor.parent(editor, path)
		if (!Element.isElement(parent) || parent.type !== LIST_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor,
				entry,
				{
					type: LIST_NODE,
					content: {
						listStyles: { type: ListStyles.TYPE_UNORDERED }
					},
					children: []
				},
				node => node.subtype === LIST_LINE_NODE
			)
			return
		}
	}

	next(entry, editor)
}

export default normalizeNode
