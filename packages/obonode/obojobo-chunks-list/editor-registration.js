import React from 'react'
import { Editor, Node, Element, Transforms } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Level from './components/level/editor-component'
import Line from './components/line/editor-component'
import Converter from './converter'

import normalizeNode from './changes/normalize-node'
import onBackspace from './changes/on-backspace'
import insertText from './changes/insert-text'
import unwrapLevel from './changes/unwrap-level'
import wrapLevel from './changes/wrap-level'
import wrapLevelOrTab from './changes/wrap-level-or-tab'
import toggleHangingIndent from './changes/toggle-hanging-indent'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const plugins = {
	// Editor Plugins - These get attached to the editor object and override it's default functions
	// They may affect multiple nodes simultaneously
	insertData(data, editor, next) {
		// Insert Slate fragments normally
		if (data.types.includes('application/x-slate-fragment')) return next(data)

		// If the node that we will be inserting into is not a Code node use the regular logic
		const [first] = Editor.nodes(editor, { match: node => Element.isElement(node) })
		if (first[0].type !== LIST_NODE) return next(data)

		// When inserting plain text into a Code node insert all lines as code
		const plainText = data.getData('text/plain')
		const fragment = plainText.split('\n').map(text => ({
			type: LIST_NODE,
			subtype: LIST_LINE_NODE,
			content: {},
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
					placeholder: 'Type your text here',
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
				return onBackspace(entry, editor, event)

			case 'Tab':
				// TAB+SHIFT
				if (event.shiftKey) return unwrapLevel(entry, editor, event)

				// TAB + ALT
				if (event.altKey) return wrapLevel(entry, editor, event)

				// TAB
				return wrapLevelOrTab(entry, editor, event)

			case 'Enter':
				return insertText(entry, editor, event)

			case 'h':
				if (event.ctrlKey || event.metaKey) return toggleHangingIndent(entry, editor, event)
		}
	},
	renderNode(props) {
		switch (props.element.subtype) {
			case LIST_LINE_NODE:
				return <Line {...props} {...props.attributes} />
			case LIST_LEVEL_NODE:
				return <Level {...props} {...props.attributes} />
			default:
				return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

const List = {
	name: LIST_NODE,
	menuLabel: 'List',
	icon: Icon,
	isInsertable: true,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins
}

export default List
