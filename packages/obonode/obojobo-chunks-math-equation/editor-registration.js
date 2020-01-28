import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Converter from './converter'

const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'

const MathEquation = {
	name: MATH_NODE,
	menuLabel: 'Math Equation',
	icon: Icon,
	isInsertable: true,
	isContent: true,
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
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	}
}

export default MathEquation
