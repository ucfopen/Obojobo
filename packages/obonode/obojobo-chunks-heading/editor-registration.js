import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Element from './editor-component'
import Schema from './schema'
import Converter from './converter'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

const Heading = {
	name: HEADING_NODE,
	menuLabel: 'Heading',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderPlaceholder(props, editor, next) {
			const { node } = props
			if (node.object !== 'block' || node.type !== HEADING_NODE) return next()
			if (node.text !== '') return next()

			return (
				<span
					className={`placeholder align-${node.data.get('content').align}`}
					contentEditable={false}
					data-placeholder="Type Your Heading Here"
				/>
			)
		},
		renderNode(props) {
			return <Element {...props} {...props.attributes} />
		},
		schema: Schema
	},
	getNavItem(model) {
		switch (model.modelState.headingLevel) {
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
}

export default Heading
