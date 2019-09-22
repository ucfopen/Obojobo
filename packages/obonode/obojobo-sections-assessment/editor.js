import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { getEventTransfer } from 'slate-react'
import { Document } from 'slate'

const UNIQUE_NAME = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'

import Node from './editor-component'
import Settings from './components/settings/editor-component'
import Converter from './converter'
import Schema from './schema'

const Assessment = {
	name: UNIQUE_NAME,
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	getNavItem(model) {
		const title = model.title || 'Assessment'
		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		}
	},
	plugins: {
		onPaste(event, editor, next) {
			const transfer = getEventTransfer(event)

			if (transfer.type !== 'fragment' || transfer.fragment.nodes.get(0).type !== UNIQUE_NAME) {
				return next()
			}

			const cutAssessment = transfer.fragment.nodes.get(0).toJSON()
			const jsonFragment = {
				object: 'document',
				nodes: cutAssessment.nodes
			}

			return editor.insertFragment(Document.fromJSON(jsonFragment))
		},
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case UNIQUE_NAME:
					return <Node {...props} {...props.attributes} />
				case SETTINGS_NODE:
					return <Settings {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default Assessment
