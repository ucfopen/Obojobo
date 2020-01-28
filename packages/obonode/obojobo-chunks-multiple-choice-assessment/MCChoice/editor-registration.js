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
		renderNode(props) {
			console.log('rendering')
			return <Node {...props} {...props.attributes} />
		},
		schema: Schema
	}
}

export default MCChoice
