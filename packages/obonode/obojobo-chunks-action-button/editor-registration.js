import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Element from './editor-component'
import Schema from './schema'
import Converter from './converter'

const UNIQUE_NAME = 'ObojoboDraft.Chunks.ActionButton'

const ActionButton = {
	name: UNIQUE_NAME,
	menuLabel: 'Button',
	icon: Icon,
	isInsertable: true,
	components: {
		Element,
		Icon
	},
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props) {
			return <Element {...props} {...props.attributes} />
		},
		renderPlaceholder(props, editor, next) {
			const { node } = props
			if (node.object !== 'block' || node.type !== UNIQUE_NAME) return next()
			if (node.text !== '') return next()

			return (
				<span
					className={'placeholder align-center required'}
					contentEditable={false}
					data-placeholder="Your Label Here"
				/>
			)
		},
		schema: Schema
	}
}

export default ActionButton
