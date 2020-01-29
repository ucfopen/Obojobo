import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MATERIA_NODE = 'ObojoboDraft.Chunks.Materia'

const Materia = {
	name: MATERIA_NODE,
	menuLabel: 'Materia Widget',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props, editor, next) {
			console.log(props.node.type)
			switch (props.node.type) {
				case MATERIA_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default Materia
