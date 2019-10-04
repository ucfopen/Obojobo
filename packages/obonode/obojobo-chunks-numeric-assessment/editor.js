import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import Converter from './converter'
import Node from './editor-component'
import NumericInput from './components/numeric-input/numeric-input'
import NumericFeedback from './components/numeric-feedback/numeric-feedback'
import Schema from './schema'

import { SCORE_RULE_NODE, NUMERIC_ASSESSMENT_NODE, NUMERIC_FEEDBACK } from './constant'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case NUMERIC_ASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			case SCORE_RULE_NODE:
				return <NumericInput {...props} {...props.attributes} />
			case NUMERIC_FEEDBACK:
				return <NumericFeedback {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Registry.registerModel(NUMERIC_ASSESSMENT_NODE, {
	name: 'Numeric Assessment',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	supportsChildren: true,
	plugins
})

const NumericAssessment = {
	components: {
		Node
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default NumericAssessment
