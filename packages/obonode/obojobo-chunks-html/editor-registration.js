import React from 'react'
import { Element, Editor, Node } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'

const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

const HTML = {
	name: HTML_NODE,
	menuLabel: 'HTML',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		decorate([node, path], editor) {
			// Define a placeholder decoration
			if(Element.isElement(node) && Node.string(node) === ''){
				const point = Editor.start(editor, path)

				return [{
					placeholder: '<!-- HTML code here -->',
					anchor: point,
					focus: point
				}]
			}

			return []
		},
		onKeyDown(node, editor, event) {
			switch (event.key) {
				case 'Enter':


				case 'Tab':
			}
		},
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		},
		// onKeyDown(event, editor, next) {
		// 	const isHTML = editor.value.blocks.some(block => block.type === HTML_NODE)
		// 	if (!isHTML) return next()

		// 	switch (event.key) {
		// 		// Insert a softbreak on enter
		// 		case 'Enter':
		// 			event.preventDefault()
		// 			return editor.insertText('\n')

		// 		case 'Tab':
		// 			event.preventDefault()
		// 			return editor.insertText('\t')

		// 		default:
		// 			return next()
		// 	}
		// },
	}
}

export default HTML
