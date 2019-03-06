import React from 'react'

import Common from 'Common'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'

const plugins = {
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

Common.Store.registerEditorModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	name: 'Multiple Choice Answer',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const MCAnswer = {
	components: {
		Node
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default MCAnswer
