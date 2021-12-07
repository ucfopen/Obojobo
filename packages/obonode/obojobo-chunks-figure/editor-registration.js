import React from 'react'
import { Element, Editor, Node, Transforms } from 'slate'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const Figure = {
	name: FIGURE_NODE,
	menuLabel: 'Figure',
	icon: Icon,
	isInsertable: true,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a Figure, only allow Text  and inline children
			if (Element.isElement(node) && node.type === FIGURE_NODE) {
				for (const [child, childPath] of Node.children(editor, path)) {
					if (Element.isElement(child) && !editor.isInline(child)) {
						Transforms.liftNodes(editor, { at: childPath })
						return
					}
				}
			}

			next(entry, editor)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		decorate([node, path], editor) {
			// Define a placeholder decoration
			if (Element.isElement(node) && Node.string(node) === '') {
				const point = Editor.start(editor, path)

				return [
					{
						placeholder: 'Type an image caption here',
						anchor: point,
						focus: point
					}
				]
			}

			return []
		},
		onKeyDown(entry, editor, event) {
			if (event.key === 'Enter') return KeyDownUtil.breakToText(event, editor, entry)

			if (event.key === 'Delete') {
				const text = entry[0].children[0].text

				if (editor.selection.anchor.offset === text.length) {
					event.preventDefault()
				}
			}
		},
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		},
		insertItemInto(editor, item) {
			const path = Editor.path(editor, editor.selection, { edge: 'start' })
			const prevChildrenCount = editor.children.length

			Transforms.insertNodes(editor, item.cloneBlankNode())

			// Since inserting a node inside a figure caption can sometimes
			// cause figure to be duplicated after the caption is split, we
			// need to convert the duplicated figure below to a text node.
			if (editor.children.length !== prevChildrenCount + 1) {
				// Because we want the figure two lines below,
				// we need to ignore the last value in the path since
				// it refers to the figure's caption.
				const newPath = [...path.slice(0, path.length - 1)]
				newPath[newPath.length - 1] += 2

				Transforms.setNodes(
					editor,
					{
						type: TEXT_NODE,
						content: {}
					},
					{
						at: [...newPath]
					}
				)
			}
		}
	}
}

export default Figure
