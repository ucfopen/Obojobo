import React from 'react'
import { getEventTransfer } from 'slate-react'
import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

const Figure = {
	name: FIGURE_NODE,
	menuLabel: 'Figure',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		onPaste(event, editor, next) {
			const transfer = getEventTransfer(event)

			// Only paste plain text
			if (transfer.type !== 'fragment') {
				editor.insertText(transfer.text)
				return
			}

			return next()
		},
		renderPlaceholder(props, editor, next) {
			const { node } = props
			if (node.object !== 'block' || node.type !== FIGURE_NODE) return next()
			if (node.text !== '') return next()

			return (
				<span
					className={'placeholder align-center required'}
					contentEditable={false}
					data-placeholder="Type Your Caption Here"
				/>
			)
		},
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case FIGURE_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default Figure
