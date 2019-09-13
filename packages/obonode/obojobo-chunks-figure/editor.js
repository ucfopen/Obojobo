import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

const plugins = {
	renderPlaceholder(props, editor, next) {
		const { node } = props
		if (node.object !== 'block' || node.type !== FIGURE_NODE) return next()
		if (node.text !== '') return next()

		return (
			<span className={'placeholder align-center'} contentEditable={false}>
				{'Type Your Caption Here'}
			</span>
		)
	},
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case FIGURE_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.Figure', {
	name: 'Figure',
	icon: Icon,
	isInsertable: true,
	templateObject: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Figure = {
	name: FIGURE_NODE,
	components: {
		Node,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default Figure
