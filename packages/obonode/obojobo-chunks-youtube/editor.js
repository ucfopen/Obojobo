import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

const plugins = {
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

Common.Registry.registerModel('ObojoboDraft.Chunks.YouTube', {
	name: 'YouTube',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const YouTube = {
	name: YOUTUBE_NODE,
	components: {
		Node,
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

export default YouTube
