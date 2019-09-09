import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case IFRAME_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.IFrame', {
	name: 'IFrame',
	icon: Icon,
	isInsertable: true,
	templateObject: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const IFrame = {
	name: IFRAME_NODE,
	components: {
		Node,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default IFrame
