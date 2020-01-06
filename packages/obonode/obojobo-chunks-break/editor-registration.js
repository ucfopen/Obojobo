import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

const isType = editor => {
	return editor.value.blocks.some(block => block.type === BREAK_NODE)
}

const Break = {
	name: BREAK_NODE,
	menuLabel: 'Horizontal Line',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case BREAK_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		// See issue https://github.com/ucfopen/Obojobo/issues/1054
		// To fix slate moving focus around and scrolling the page the Break
		// element has a text node. This solves the issue but we don't really
		// want any content to be put in this node, it's only there to give
		// slate something to focus on. So we prevent any meaningful input
		// to keep the node blank:
		onBeforeInput(event, editor, next) {
			if (isType(editor)) {
				event.preventDefault()
			}

			return next()
		},
		// @HACK: There isn't a way to prevent pasting in this version of
		// slate, so if the user is focused on our blank node and pastes
		// we need to cancel it. The hack du jour is undoing the paste action.
		onPaste(event, editor, next) {
			if (isType(editor)) {
				next()
				editor.undo()
				return
			}

			return next()
		},
		schema: Schema
	}
}

export default Break
