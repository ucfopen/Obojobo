import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const COMPONENT_NODE = 'oboeditor.component'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case COMPONENT_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

const ComponentNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default ComponentNode
