import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Converter from './converter'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

const Break = {
	name: BREAK_NODE,
	menuLabel: 'Horizontal Line',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		renderNode(props) {
			return <Node {...props} {...props.attributes} />
		},
		isVoid(element, editor, next) {
			if(element.type === BREAK_NODE) return true

			next(element)
		}
	}
}

export default Break
