import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'
import React from 'react'
import NC from './components/numeric-choice/editor-component'
import NA from './components/numeric-answer/editor-component'

const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'

const NumericAssessment = {
	name: 'ObojoboDraft.Chunks.NumericAssessment',
	menuLabel: 'Numeric Assessment',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case NUMERIC_ASSESSMENT_NODE:
					return <Node {...props} {...props.attributes} />
				case 'ObojoboDraft.Chunks.NumericAssessment.NumericChoice':
					return <NC {...props} {...props.attributes} />
				case 'ObojoboDraft.Chunks.NumericAssessment.NumericAnswer':
					return <NA {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default NumericAssessment
