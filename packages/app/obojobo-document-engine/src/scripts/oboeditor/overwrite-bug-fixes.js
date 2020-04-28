/* eslint-disable */
import { Editor, Element, Transforms, Path, Text, Range } from 'slate'

// Most of this method is copied from Slate, with the emptyAncestor code edited
// so that it does not unintentionaly delete ancestors deep in the tree
Transforms.mergeNodes = (editor, options) =>
	Editor.withoutNormalizing(editor, () => {
		let { match, at = editor.selection } = options
		const { hanging = false, voids = false, mode = 'lowest' } = options

		if (!at) {
			return
		}

		if (match == null) {
			if (Path.isPath(at)) {
				const [parent] = Editor.parent(editor, at)
				match = n => parent.children.includes(n)
			} else {
				match = n => Editor.isBlock(editor, n)
			}
		}

		if (!hanging && Range.isRange(at)) {
			at = Editor.unhangRange(editor, at)
		}

		if (Range.isRange(at)) {
			if (Range.isCollapsed(at)) {
				at = at.anchor
			} else {
				const [, end] = Range.edges(at)
				const pointRef = Editor.pointRef(editor, end)
				Transforms.delete(editor, { at })
				at = pointRef.unref()

				if (options.at == null) {
					Transforms.select(editor, at)
				}
			}
		}

		const [current] = Editor.nodes(editor, { at, match, voids, mode })
		const prev = Editor.previous(editor, { at, match, voids, mode })

		if (!current || !prev) {
			return
		}

		const [node, path] = current
		const [prevNode, prevPath] = prev

		if (path.length === 0 || prevPath.length === 0) {
			return
		}

		const newPath = Path.next(prevPath)
		const commonPath = Path.common(path, prevPath)
		const isPreviousSibling = Path.isSibling(path, prevPath)
		const levels = Array.from(Editor.levels(editor, { at: path }), ([n]) => n)
			.slice(commonPath.length)
			.slice(0, -1)
			.reverse()

		// Determine if the merge will leave the direct ancestor of the path empty as a
		// result of the move, in which case we'll want to remove the deepest empty
		// ancestor after merging.
		let deepestEmptyAncestor
		for (const ancestor of levels) {
			if (!Element.isElement(ancestor) || ancestor.children.length !== 1) break
			deepestEmptyAncestor = ancestor
		}
		const emptyAncestor = Editor.above(editor, {
			at: path,
			mode: 'highest',
			match: n => n === deepestEmptyAncestor
		})

		const emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1])
		let properties
		let position

		// Ensure that the nodes are equivalent, and figure out what the position
		// and extra properties of the merge will be.
		if (Text.isText(node) && Text.isText(prevNode)) {
			const { text, ...rest } = node
			position = prevNode.text.length
			properties = rest
		} else if (Element.isElement(node) && Element.isElement(prevNode)) {
			const { children, ...rest } = node
			position = prevNode.children.length
			properties = rest
		} else {
			throw new Error(
				`Cannot merge the node at path [${path}] with the previous sibling because it is not the same kind: ${JSON.stringify(
					node
				)} ${JSON.stringify(prevNode)}`
			)
		}

		// If the node isn't already the next sibling of the previous node, move
		// it so that it is before merging.
		if (!isPreviousSibling) {
			Transforms.moveNodes(editor, { at: path, to: newPath, voids })
		}

		// If there was going to be an empty ancestor of the node that was merged,
		// we remove it from the tree.
		if (emptyRef) {
			Transforms.removeNodes(editor, { at: emptyRef.current, voids })
		}

		// If the target node that we're merging with is empty, remove it instead
		// of merging the two. This is a common rich text editor behavior to
		// prevent losing formatting when deleting entire nodes when you have a
		// hanging selection.
		if (
			(Element.isElement(prevNode) && Editor.isEmpty(editor, prevNode)) ||
			(Text.isText(prevNode) && prevNode.text === '')
		) {
			Transforms.removeNodes(editor, { at: prevPath, voids })
		} else {
			editor.apply({
				type: 'merge_node',
				path: newPath,
				position,
				target: null,
				properties
			})
		}

		if (emptyRef) {
			emptyRef.unref()
		}
	})
