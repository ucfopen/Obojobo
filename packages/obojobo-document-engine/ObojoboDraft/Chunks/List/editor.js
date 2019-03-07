import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Level from './components/level/editor-component'
import Line from './components/line/editor-component'
import Schema from './schema'
import Converter from './converter'

import onBackspace from './changes/on-backspace'
import insertText from './changes/insert-text'
import unwrapLevel from './changes/unwrap-level'
import wrapLevel from './changes/wrap-level'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const isType = change => {
	return change.value.blocks.some(block => {
		return !!change.value.document.getClosest(block.key, parent => {
			return parent.type === LIST_NODE
		})
	})
}

const plugins = {
	onKeyDown(event, change) {
		// See if any of the selected nodes have a CODE_NODE parent
		const isLine = isType(change)
		if (!isLine) return

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return onBackspace(event, change)

			case 'Enter':
				// Text lines will be changed to list lines by the schema unless
				// they are at the end of the list
				return insertText(event, change)

			case 'Tab':
				// TAB+SHIFT
				if (event.shiftKey) return wrapLevel(event, change)

				// TAB
				return unwrapLevel(event, change)
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case LIST_NODE:
				return <Node {...props} {...props.attributes} />
			case LIST_LINE_NODE:
				return <Line {...props} {...props.attributes} />
			case LIST_LEVEL_NODE:
				return <Level {...props} {...props.attributes} />
		}
	},
	normalizeNode(node) {
		if (node.object !== 'block') return
		if (node.type !== LIST_NODE && node.type !== LIST_LEVEL_NODE) return
		if (node.nodes.size <= 1) return

		// Checks children for two consecutive list levels
		// If consecutive levels are found, return the second one so it can be
		// merged into its previous sibling
		const invalids = node.nodes
			.map((child, i) => {
				const next = node.nodes.get(i + 1)
				if (child.type !== LIST_LEVEL_NODE || !next || next.type !== LIST_LEVEL_NODE) return false
				return next
			})
			.filter(Boolean)

		if (invalids.size === 0) return

		return change => {
			change.withoutNormalization(c => {
				// Reverse the list to handle consecutive merges, since the
				// earlier nodes will always exist after each merge.
				invalids.forEach(n => {
					c.mergeNodeByKey(n.key)
				})
			})
		}
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.List', {
	name: 'List',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const List = {
	name: LIST_NODE,
	components: {
		Node,
		Level,
		Line,
		Icon
	},
	helpers: {
		isType,
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default List
