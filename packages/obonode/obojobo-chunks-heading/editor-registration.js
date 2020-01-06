import { getEventTransfer } from 'slate-react'
import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

const isType = editor => {
	return editor.value.blocks.some(block => block.type === HEADING_NODE)
}

const Heading = {
	name: HEADING_NODE,
	menuLabel: 'Heading',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		onPaste(event, editor, next) {
			const isHeading = isType(editor)
			const transfer = getEventTransfer(event)

			// If we are pasting standard text (not-html) then we simply
			// put the text inside the existing heading node. If we don't
			// do this the page will crash when pasting text into a blank
			// heading node.
			if (isHeading && transfer.type === 'text') {
				editor.insertText(transfer.text)
				return
			}

			return next()
		},
		renderPlaceholder(props, editor, next) {
			const { node } = props
			if (node.object !== 'block' || node.type !== HEADING_NODE) return next()
			if (node.text !== '') return next()

			return (
				<span
					className={`placeholder align-${node.data.get('content').align}`}
					contentEditable={false}
					data-placeholder="Type Your Heading Here"
				/>
			)
		},
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case HEADING_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	},
	getNavItem(model) {
		switch (model.modelState.headingLevel) {
			case 1:
			case 2:
				if (model.modelState.headingLevel === 1 && model.getIndex() === 0) {
					return null
				}

				return {
					type: 'sub-link',
					label: model.modelState.textGroup.first.text,
					path: [
						model
							.toText()
							.toLowerCase()
							.replace(/ /g, '-')
					],
					showChildren: false
				}

			default:
				return null
		}
	}
}

export default Heading
