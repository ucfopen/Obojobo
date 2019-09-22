import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const UNIQUE_NAME = 'ObojoboDraft.Chunks.ActionButton'

const ActionButton = {
	name: UNIQUE_NAME,
	menuLabel: 'Button',
	icon: Icon,
	isInsertable: true,
	components: {
		Node,
		Icon
	},
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case UNIQUE_NAME:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		renderPlaceholder(props, editor, next) {
			const { node } = props
			if (node.object !== 'block' || node.type !== UNIQUE_NAME) return next()
			if (node.text !== '') return next()

			return (
				<span className={'placeholder align-center'} contentEditable={false}>
					{'Your Label Here'}
				</span>
			)
		},
		schema: Schema
	}
}

export default ActionButton
