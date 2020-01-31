import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

import { NUMERIC_FEEDBACK_NODE } from '../constants'

const plugins = {
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

Common.Registry.registerModel(NUMERIC_FEEDBACK_NODE, {
	name: 'Numeric Choice Feedback',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	supportsChildren: true,
	plugins
})

const NumericFeedback = {
	components: {
		Node
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default NumericFeedback
