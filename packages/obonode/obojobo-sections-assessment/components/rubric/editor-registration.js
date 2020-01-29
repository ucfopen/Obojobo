import React from 'react'

import RubricComponent from './editor-component'
import Schema from './schema'
import Converter from './converter'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case RUBRIC_NODE:
				return <RubricComponent {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

const Rubric = {
	name: RUBRIC_NODE,
	helpers: Converter,
	plugins
}

export default Rubric
