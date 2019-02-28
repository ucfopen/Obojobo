import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case PAGE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Pages.Page', {
	name: 'Page',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins,
	getNavItem(model) {
		let label

		if (model.title) {
			label = model.title
		} else {
			const pages = model.parent.children.models.filter(
				child => child.get('type') === 'ObojoboDraft.Pages.Page'
			)
			label = `Page ${pages.indexOf(model) + 1}`
		}

		return {
			type: 'link',
			label,
			path: [label.toLowerCase().replace(/ /g, '-')],
			showChildren: false
		}
	}
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
