import React from 'react'
import { Transforms, Node, Range, Path, Editor, Element } from 'slate'

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

		const moveCursor = direction => {

			const [tablePath] = Editor.nodes(editor, {
				mode: 'lowest',
				match: nodeMatch => Element.isElement(nodeMatch)
			})

			// Getting the cell in which we last clicked on.
			const [node, row, col] = tablePath[1]

			let nextPath;

			switch (direction) {
				case "down":
					nextPath = [node, row+1, col, 0];
					break;
				case "right":
					nextPath = [node, row, col+1, 0];
					break;
				case "up":
					nextPath = [node, row-1, col, 0];
					break;
				case "left":
					nextPath = [node, row, col-1, 0];
					break;
				default:
					break;
			}

			if (Node.has(editor, nextPath)) {
				// If there is, jump down to the cell
				// below the current one
				const focus = Editor.start(editor, nextPath)
				const anchor = Editor.end(editor, nextPath)
				Transforms.setSelection(editor, {
					focus,
					anchor
				})
			}

		}

		const collapsed = Range.isCollapsed(editor.selection);
		console.log(collapsed);

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteNodeContents(event, editor, entry, event.key === 'Delete')

			case 'Enter':
			case 'ArrowDown':
				event.preventDefault()
				moveCursor("down");
				break;
			case 'Tab':
			case 'ArrowRight':
				if (collapsed) break;

				event.preventDefault();
				moveCursor("right");
				break;
			case 'ArrowLeft':
				if (collapsed) break;

				event.preventDefault()
				moveCursor("left");
				break;
			case 'ArrowUp':
				event.preventDefault()
				moveCursor("up");
				break;

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
