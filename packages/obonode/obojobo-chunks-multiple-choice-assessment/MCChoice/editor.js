import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const MCChoice = {
	name: MCCHOICE_NODE,
	menuLabel: 'Multiple Choice Choice',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case MCCHOICE_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default MCChoice
