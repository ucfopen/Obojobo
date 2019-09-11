import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import Node from './editor-component'
import ChoiceList from './components/choice-list/editor-component'
import Settings from './components/settings/editor-component'
import Schema from './schema'
import Converter from './converter'

import './MCAnswer/editor'
import './MCChoice/editor'
import './MCFeedback/editor'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'

const plugins = {
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

Common.Registry.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	name: 'Multiple Choice Assessment',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	supportsChildren: true,
	plugins
})

const MCAssessment = {
	components: {
		Node,
		Settings,
		ChoiceList
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default MCAssessment
