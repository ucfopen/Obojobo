import React from 'react'
import Common from 'Common'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MCCHOICE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	name: 'Multiple Choice Choice',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const MCChoice = {
	components: {
		Node
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default MCChoice
