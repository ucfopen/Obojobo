import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const NUMERIC_FEEDBACK_NODE = 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback'

const NumericFeedback = {
	name: NUMERIC_FEEDBACK_NODE,
	menuLabel: 'Numeric Feedback',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case NUMERIC_FEEDBACK_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default NumericFeedback
