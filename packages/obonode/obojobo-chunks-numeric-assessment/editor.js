import Common from 'obojobo-document-engine/src/scripts/common'
import Converter from './converter'
import Node from './editor-component'
import React from 'react'

const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case NUMERIC_ASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	}
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
