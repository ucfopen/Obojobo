import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { getEventTransfer, cloneFragment } from 'slate-react'

import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Row from './components/row/editor-component'
import Cell from './components/cell/editor-component'
import Schema from './schema'
import Converter from './converter'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

const isType = editor =>
	editor.value.blocks.some(
		block => !!editor.value.document.getClosest(block.key, parent => parent.type === TABLE_NODE)
	)

const plugins = {
	onPaste(event, editor, next) {
		// See if any of the selected nodes have a TABLE_NODE parent
		const isTable = isType(editor)
		if (!isTable) return next()

		// When pasting into a table, paste everything as plain text
		const transfer = getEventTransfer(event)
		editor.insertText(transfer.text)
	},
	onCut(event, editor, next) {
		// See if any of the selected nodes have a TABLE_NODE parent
		const isTable = isType(editor)
		if (!isTable) return next()

		// Copy the fragment and then delete the contents of the nodes
		// without deleting the nodes themselves
		const cutFragment = editor.value.fragment
		KeyDownUtil.deleteNodeContents(event, editor, next)

		return cloneFragment(event, editor, next, cutFragment)
	},
	onKeyDown(event, editor, next) {
		// See if any of the selected nodes have a TABLE_NODE parent
		const isTable = isType(editor)
		if (!isTable) return next()

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteNodeContents(event, editor, next)

			case 'Enter':
				// Disallows enter
				event.preventDefault()
				return true

			default:
				return next()
		}
	},
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case TABLE_NODE:
				return <Node {...props} {...props.attributes} />
			case TABLE_ROW_NODE:
				return <Row {...props} {...props.attributes} />
			case TABLE_CELL_NODE:
				return <Cell {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	normalizeNode(node, editor, next) {
		if (node.object !== 'block') return next()
		if (node.type !== TABLE_ROW_NODE) return next()

		// Normalize Rows with the wrong number of cells
		const numCols = node.data.get('content').numCols
		if (node.nodes.size < numCols) {
			const header = node.data.get('content').header

			// Insert missing cells at the end of the row
			return editor => {
				for (let i = node.nodes.size; i < numCols; i++) {
					editor.insertNodeByKey(node.key, i, {
						object: 'block',
						type: 'ObojoboDraft.Chunks.Table.Cell',
						data: { content: { header } },
						nodes: [
							{
								object: 'text',
								leaves: [{ object: 'leaf', text: '', marks: [] }]
							}
						]
					})
				}
			}
		}

		if (node.nodes.size > numCols) {
			return editor => {
				editor.setNodeByKey(node.key, { 
					data: { 
						content: {
							...node.data.get('content'),
							numCols: node.nodes.size
						} 

					} 
				})
			}
		}

		return next()
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.Table', {
	name: 'Table',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Table = {
	name: TABLE_NODE,
	components: {
		Node,
		Row,
		Cell,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default Table
