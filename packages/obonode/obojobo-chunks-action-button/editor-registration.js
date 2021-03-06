import React from 'react'
import { Element, Editor, Node, Transforms } from 'slate'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'

const UNIQUE_NAME = 'ObojoboDraft.Chunks.ActionButton'

const ActionButton = {
	name: UNIQUE_NAME,
	menuLabel: 'Button',
	icon: Icon,
	isInsertable: true,
	isContent: true,
	components: {
		EditorComponent,
		Icon
	},
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object and override its default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is an Action Button, only allow Text and inline children
			if (Element.isElement(node) && node.type === UNIQUE_NAME) {
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
						placeholder: 'Your label here',
						anchor: point,
						focus: point
					}
				]
			}

			return []
		},
		onKeyDown(entry, editor, event) {
			switch (event.key) {
				case 'Enter':
					return KeyDownUtil.breakToText(event, editor, entry)
			}
		},
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default ActionButton
