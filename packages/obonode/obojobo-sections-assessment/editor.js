import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

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

Common.Registry.registerModel(ASSESSMENT_NODE, {
	name: 'Assessment',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	getNavItem(model) {
		const title = model.title || 'Assessment'
		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		}
	}
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
