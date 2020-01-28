import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'

const MCAssessment = {
	name: 'ObojoboDraft.Chunks.MCAssessment',
	menuLabel: 'Multiple Choice Assessment',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props) {
			return <Node {...props} {...props.attributes} />
		},
		schema: Schema
	}
}

export default MCAssessment
