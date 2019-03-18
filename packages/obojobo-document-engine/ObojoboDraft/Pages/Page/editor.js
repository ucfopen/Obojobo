import React from 'react'
import Common from 'Common'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case PAGE_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Pages.Page', {
	name: 'Page',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Page = {
	components: {
		Node
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default Page
