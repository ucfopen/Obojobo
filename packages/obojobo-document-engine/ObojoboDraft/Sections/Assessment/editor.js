import React from 'react'
import Common from 'Common'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'

import Node from './editor-component'
import Settings from './components/settings/editor-component'
import Converter from './converter'
import Schema from './schema'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case ASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			case SETTINGS_NODE:
				return <Settings {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Store.registerEditorModel(ASSESSMENT_NODE, {
	name: 'Assessment',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Assessment = {
	components: {
		Node,
		Settings
	},
	helpers: Converter,
	plugins
}

export default Assessment
