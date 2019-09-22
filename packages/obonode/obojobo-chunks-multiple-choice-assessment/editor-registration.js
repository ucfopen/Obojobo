import React from 'react'

import Node from './editor-component'
import ChoiceList from './components/choice-list/editor-component'
import Settings from './components/settings/editor-component'
import Schema from './schema'
import Converter from './converter'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'

const MCAssessment = {
	name: 'ObojoboDraft.Chunks.MCAssessment',
	menuLabel: 'Multiple Choice Assessment',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case MCASSESSMENT_NODE:
					return <Node {...props} {...props.attributes} />
				case SETTINGS_NODE:
					return <Settings {...props} {...props.attributes} />
				case CHOICE_LIST_NODE:
					return <ChoiceList {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default MCAssessment
