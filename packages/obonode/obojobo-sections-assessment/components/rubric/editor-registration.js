import React from 'react'
import { Editor, Element, Transforms } from 'slate'

import RubricComponent from './editor-component'
import Converter from './converter'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const plugins = {
	// Editor Plugins - These get attached to the editor object an override it's default functions
	// They may affect multiple nodes simultaneously
	normalizeNode(entry, editor, next) {
		const [node, path] = entry

		// If the element is a Rubric Node, make sure it has an Assessment parent
		if (node.type === RUBRIC_NODE && !node.subtype) {
			const [parent] = Editor.parent(editor, path)
			if (!Element.isElement(parent) || parent.type !== ASSESSMENT_NODE) {
				Transforms.removeNodes(editor, { at: path })
				return
			}
		}

		next(entry, editor)
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
