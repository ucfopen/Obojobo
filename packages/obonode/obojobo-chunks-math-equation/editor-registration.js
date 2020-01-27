import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Converter from './converter'

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
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		isVoid(element, editor, next) {
			if(element.type === MATH_NODE) return true

			return next(element)
		},
		renderNode(props) {
			return <Node {...props} {...props.attributes} />
		}
	}
}

export default MathEquation
