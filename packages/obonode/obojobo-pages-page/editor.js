import React from 'react'

import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'


const Page = {
	name: PAGE_NODE,
	menuLabel: 'Page',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case PAGE_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	},
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
}

export default Page
