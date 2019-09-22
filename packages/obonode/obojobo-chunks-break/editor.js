import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

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
		schema: Schema
	}
}

export default Break
