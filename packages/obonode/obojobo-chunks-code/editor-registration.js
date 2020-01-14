import { Editor, Node, Element, Transforms, Text } from 'slate'

import Converter from './converter'
import Icon from './icon'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
import Line from './components/line/editor-component'
import CodeNode from './editor-component'
import React from 'react'
import decreaseIndent from './changes/decrease-indent'
import emptyNode from './empty-node.json'
import increaseIndent from './changes/increase-indent'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const Code = {
	name: CODE_NODE,
	icon: Icon,
	menuLabel: 'Code',
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
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
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		onKeyDown(node, editor, event) {
			switch (event.key) {
				case 'Backspace':
				case 'Delete':
					return KeyDownUtil.deleteEmptyParent(event, editor, node, event.key === 'Delete')

				case 'Tab':
					// TAB+SHIFT
					if (event.shiftKey) return decreaseIndent(node, editor, event)

					// TAB
					return increaseIndent(node, editor, event)
			}
		},
		renderNode(props) {
			switch (props.element.subtype) {
				case CODE_LINE_NODE:
					return <Line {...props} {...props.attributes} />
				default:
					return <CodeNode {...props} {...props.attributes} />
			}
		},
	}
}

export default Code
