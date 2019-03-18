import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

const plugins = {
	renderPlaceholder(props, editor, next) {
		const { node } = props
		if (node.object !== 'block' || node.type !== HEADING_NODE) return next()
		if (node.text !== '') return next()

		return (
			<span
				className={'placeholder align-' + node.data.get('content').align}
				contentEditable={false}
			>
				{'Type Your Heading Here'}
			</span>
		)
	},
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case HEADING_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Heading', {
	name: 'Heading',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Heading = {
	name: HEADING_NODE,
	components: {
		Node,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default Heading
