import React from 'react'

import RubricComponent from './editor-component'
import Converter from './converter'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

const plugins = {
	// Editor Plugins - These get attached to the editor object an override it's default functions
	// They may affect multiple nodes simultaneously
	isVoid(element, editor, next) {
		if(element.type === RUBRIC_NODE) return true

		return next(element)
	},
	// Editable Plugins - These are used by the PageEditor component to augment React functions
	// They affect individual nodes independently of one another
	renderNode(props) {
		return <RubricComponent {...props} {...props.attributes} />
	}
}

const Rubric = {
	name: RUBRIC_NODE,
	helpers: Converter,
	plugins
}

export default Rubric
