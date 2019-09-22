import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

const YouTube = {
	name: YOUTUBE_NODE,
	menuLabel: 'YouTube',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case YOUTUBE_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default YouTube
