import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'
import includeTextCancellingPlugins from 'obojobo-document-engine/src/scripts/oboeditor/util/include-text-cancelling-plugins'

const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'

const MathEquation = {
	name: MATH_NODE,
	menuLabel: 'Math Equation',
	icon: Icon,
	isInsertable: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: includeTextCancellingPlugins(MATH_NODE, {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case MATH_NODE:
					return <Node {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	})
}

export default MathEquation
