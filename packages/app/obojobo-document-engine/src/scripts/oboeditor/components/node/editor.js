import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const COMPONENT_NODE = 'oboeditor.component'

const ComponentNode = {
	helpers: Converter,
	plugins: {
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
}

export default ComponentNode
