import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case BUTTON_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	renderPlaceholder(props, editor, next) {
		const { node } = props
		if (node.object !== 'block' || node.type !== BUTTON_NODE) return next()
		if (node.text !== '') return next()

		return (
			<span className={'placeholder align-center'} contentEditable={false} data-placeholder="Your Label Here"/>
		)
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.ActionButton', {
	name: 'Button',
	icon: Icon,
	isInsertable: true,
	templateObject: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const ActionButton = {
	name: BUTTON_NODE,
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

export default ActionButton
