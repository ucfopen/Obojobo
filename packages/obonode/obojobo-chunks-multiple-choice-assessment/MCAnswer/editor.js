import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'

const MCAnswer = {
	name: MCANSWER_NODE,
	menuLabel: 'Multiple Choice Answer',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case MCANSWER_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default MCAnswer
