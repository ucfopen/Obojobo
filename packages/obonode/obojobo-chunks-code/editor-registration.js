import { Editor, Node, Element, Transforms } from 'slate'

import Converter from './converter'
import Icon from './editor-icon.svg'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import Line from './components/line/editor-component'
import EditorComponent from './editor-component'
import React from 'react'

import normalizeNode from './changes/normalize-node'
import decreaseIndent from './changes/decrease-indent'
import emptyNode from './empty-node.json'
import increaseIndent from './changes/increase-indent'
import indentOrTab from './changes/indent-or-tab'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const Code = {
	name: CODE_NODE,
	icon: Icon,
	menuLabel: 'Code',
	isInsertable: true,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		insertData(data, editor, next) {
			// Insert Slate fragments normally
			if (data.types.includes('application/x-slate-fragment')) return next(data)

			// If the node that we will be inserting into is not a Code node use the regular logic
			const [first] = Editor.nodes(editor, { match: node => Element.isElement(node) })
			if (first[0].type !== CODE_NODE) return next(data)

			// When inserting plain text into a Code node insert all lines as code
			const plainText = data.getData('text/plain')
			const fragment = plainText.split('\n').map(text => ({
				type: CODE_NODE,
				subtype: CODE_LINE_NODE,
				content: { indent: 0, hangingIndent: false },
				children: [{ text }]
			}))

			Transforms.insertFragment(editor, fragment)
		},
		normalizeNode,
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		decorate([node, path], editor) {
			// Define a placeholder decoration
			if (Element.isElement(node) && !node.subtype && Node.string(node) === '') {
				const point = Editor.start(editor, path)

				return [
					{
						placeholder: 'Type your code here',
						anchor: point,
						focus: point
					}
				]
			}

			return []
		},
		onKeyDown(entry, editor, event) {
			switch (event.key) {
				case 'Backspace':
				case 'Delete':
					return KeyDownUtil.deleteEmptyParent(event, editor, entry, event.key === 'Delete')

				case 'Tab':
					// TAB+SHIFT
					if (event.shiftKey) return decreaseIndent(entry, editor, event)

					// TAB+ALT
					if (event.altKey) return increaseIndent(entry, editor, event)

					// TAB
					return indentOrTab(entry, editor, event)
			}
		},
		renderNode(props) {
			switch (props.element.subtype) {
				case CODE_LINE_NODE:
					return <Line {...props} {...props.attributes} />
				default:
					return <EditorComponent {...props} {...props.attributes} />
			}
		}
	}
}

export default Code
