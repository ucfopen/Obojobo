import React from 'react'
import Common from 'Common'

import Node from './editor-component'
import ChoiceList from './components/choice-list/editor-component'
import Settings from './components/settings/editor-component'
import Schema from './schema'
import Converter from './converter'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MCASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			case SETTINGS_NODE:
				return <Settings {...props} {...props.attributes} />
			case CHOICE_LIST_NODE:
				return <ChoiceList {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	name: 'Multiple Choice Assessment',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
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
