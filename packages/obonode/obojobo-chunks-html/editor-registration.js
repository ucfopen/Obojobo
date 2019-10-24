import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
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
		renderPlaceholder(props, editor, next) {
			const { node } = props
			if (node.object !== 'block' || node.type !== HTML_NODE) return next()
			if (node.text !== '') return next()

			return (
				<span
					className="placeholder"
					contentEditable={false}
					data-placeholder="<!-- HTML code here -->"/>
			)
		},
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case HTML_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		onKeyDown(event, editor, next) {
			const isHTML = editor.value.blocks.some(block => block.type === HTML_NODE)
			if (!isHTML) return next()

			switch (event.key) {
				// Insert a softbreak on enter
				case 'Enter':
					event.preventDefault()
					return editor.insertText('\n')

				case 'Tab':
					event.preventDefault()
					return editor.insertText('\t')

				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default HTML
