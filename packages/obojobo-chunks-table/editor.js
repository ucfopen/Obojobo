import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

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

const isType = change =>
	change.value.blocks.some(
		block => !!change.value.document.getClosest(block.key, parent => parent.type === TABLE_NODE)
	)

const plugins = {
	onKeyDown(event, change) {
		// See if any of the selected nodes have a TABLE_NODE parent
		const isTable = isType(change)
		if (!isTable) return

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteNodeContents(event, change)

			case 'Enter':
				// Disallows enter
				event.preventDefault()
				return true
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case TABLE_NODE:
				return <Node {...props} {...props.attributes} />
			case TABLE_ROW_NODE:
				return <Row {...props} {...props.attributes} />
			case TABLE_CELL_NODE:
				return <Cell {...props} {...props.attributes} />
		}
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
