import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import Converter from './converter'
import Node from './editor-component'
import NumericAnswer from './components/numeric-answer/editor-component'
import NumericChoice from './components/numeric-choice/editor-component'
import Schema from './schema'

import { NUMERIC_ANSWER_NODE, NUMERIC_ASSESSMENT_NODE, NUMERIC_CHOICE_NODE } from './constants'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case NUMERIC_ASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			case NUMERIC_ANSWER_NODE:
				return <NumericAnswer {...props} {...props.attributes} />
			case NUMERIC_CHOICE_NODE:
				return <NumericChoice {...props} {...props.attributes} />
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
	supportsChildren: false,
	plugins
})

const NumericAssessment = {
	components: {
		Node,
		NumericAnswer,
		NumericChoice
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default NumericAssessment
