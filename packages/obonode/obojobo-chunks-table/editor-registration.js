import React from 'react'
import { Transforms, Node, Range, Editor, Element } from 'slate'

import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
//import ClipboardUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Row from './components/row/editor-component'
import Cell from './components/cell/editor-component'
import Converter from './converter'
import normalizeNode from './changes/normalize-node'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

const plugins = {
	// Editor Plugins - These get attached to the editor object and override it's default functions
	// They may affect multiple nodes simultaneously
	insertData(data, editor, next) {
		// Insert Slate fragments normally
		if (data.types.includes('application/x-slate-fragment')) return next(data)

		// If the node that we will be inserting into is not a Code node use the regular logic
		const [first] = Editor.nodes(editor, { match: node => Element.isElement(node) })
		if (first[0].type !== TABLE_NODE) return next(data)

		// When inserting plain text into a Table node insert all lines as rows
		const plainText = data.getData('text/plain')
		const fragment = plainText.split('\n').map(text => ({
			type: TABLE_NODE,
			subtype: TABLE_ROW_NODE,
			content: { header: false, numCols: 1 },
			children: [{ text }]
		}))

		Transforms.insertFragment(editor, fragment)
	},
	normalizeNode,
	// Editable Plugins - These are used by the PageEditor component to augment React functions
	// They affect individual nodes independently of one another
	onKeyDown(entry, editor, event) {
		function moveCursor(direction) {
			// Getting the cell in which we last clicked on.
			const [node, row, col] = editor.selection.anchor.path

			let nextPath

			// Calculate next path based on direction given
			switch (direction) {
				case 'down':
					nextPath = [node, row + 1, col]
					break
				case 'right':
					nextPath = [node, row, col + 1]
					break
				case 'up':
					nextPath = [node, row - 1, col]
					break
				case 'left':
					nextPath = [node, row, col - 1]
					break
			}

			// If next path is valid, jump to it
			if (Node.has(editor, nextPath)) {
				const focus = Editor.start(editor, nextPath)
				const anchor = Editor.end(editor, nextPath)
				Transforms.setSelection(editor, {
					focus,
					anchor
				})
			} else if (direction === 'right' && Node.has(editor, (nextPath = [node, row + 1, 0]))) {
				// If moving right but already at rightmost cell, move to beginning of the row below
				const focus = Editor.start(editor, nextPath)
				const anchor = Editor.end(editor, nextPath)
				Transforms.setSelection(editor, {
					focus,
					anchor
				})
			}
		}

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteNodeContents(event, editor, entry, event.key === 'Delete')

			case 'Enter':
			case 'ArrowDown':
				event.preventDefault()
				moveCursor('down')
				break

			case 'Tab':
				// If editing text, allow tab navigation to dropdown menu
				if (Range.isCollapsed(editor.selection)) break

				event.preventDefault()

				// Handle Shift+Tab left navigation
				if (event.shiftKey) {
					moveCursor('left')
				} else {
					moveCursor('right')
				}

				break

			case 'ArrowRight':
				// If editing text, don't move to next cell
				if (Range.isCollapsed(editor.selection)) break

				event.preventDefault()
				moveCursor('right')
				break

			case 'ArrowLeft':
				// If editing text, don't move to next cell
				if (Range.isCollapsed(editor.selection)) break

				event.preventDefault()
				moveCursor('left')
				break

			case 'ArrowUp':
				event.preventDefault()
				moveCursor('up')
				break
		}
	},
	renderNode(props) {
		switch (props.element.subtype) {
			case TABLE_ROW_NODE:
				return <Row {...props} {...props.attributes} />
			case TABLE_CELL_NODE:
				return <Cell {...props} {...props.attributes} />
			default:
				return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

const Table = {
	name: TABLE_NODE,
	menuLabel: 'Table',
	icon: Icon,
	isInsertable: true,
	acceptsInserts: false,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins
}

export default Table
