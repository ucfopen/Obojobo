import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import EditorComponent from './editor-component'
import Solution from './components/solution/editor-component'
import Converter from './converter'
import normalizeNode from './changes/normalize-node'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

const Question = {
	name: QUESTION_NODE,
	menuLabel: 'Question',
	icon: Icon,
	isInsertable: true,
	supportsChildren: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode,
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			switch (props.element.subtype) {
				case SOLUTION_NODE:
					return <Solution {...props} {...props.attributes} />
				default:
					return <EditorComponent {...props} {...props.attributes} />
			}
		}
	},
	getNavItem(model) {
		let label

		if (model.title) {
			label = '' + model.title
		} else if (model.parent) {
			const questions = model.parent.children.models.filter(
				child => child.get('type') === QUESTION_NODE
			)
			label = `Question ${questions.indexOf(model) + 1}`
		} else {
			label = `Question`
		}

		return {
			type: 'sub-link',
			label,
			path: [`#obo-${model.get('id')}`]
		}
	}
}

export default Question
