import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case BUTTON_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== BUTTON_NODE) return
		if (node.text !== '') return

		return (
			<span className={'placeholder align-center'} contentEditable={false}>
				{'Your Label Here'}
			</span>
		)
	},
	schema: Schema
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.ActionButton', {
	name: 'Button',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
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
	json: {
		emptyNode
	},
	plugins
}

export default ActionButton
