import React from 'react'
import Common from 'Common'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

const plugins = {
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== HEADING_NODE) return
		if (node.text !== '') return

		return (
			<span
				className={'placeholder align-' + node.data.get('content').align}
				contentEditable={false}
			>
				{'Type Your Heading Here'}
			</span>
		)
	},
	renderNode(props) {
		switch (props.node.type) {
			case HEADING_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.Heading', {
	name: 'Heading',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins,
	getNavItem(model) {
		switch (model.modelState.headingLevel) {
			// when 1
			// 	type: 'link',
			// 	label: model.modelState.textGroup.first.text.value,
			// 	path: [model.modelState.textGroup.first.text.value.toLowerCase().replace(/ /g, '-')],
			// 	showChildren: false

			case 1:
			case 2:
				if (model.modelState.headingLevel === 1 && model.getIndex() === 0) {
					return null
				}

				return {
					type: 'sub-link',
					label: model.modelState.textGroup.first.text,
					path: [
						model
							.toText()
							.toLowerCase()
							.replace(/ /g, '-')
					],
					showChildren: false
				}

			default:
				return null
		}
	}
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
