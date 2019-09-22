import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Solution from './components/solution/editor-component'
import Schema from './schema'
import Converter from './converter'

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
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case QUESTION_NODE:
					return <Node {...props} {...props.attributes} />
				case SOLUTION_NODE:
					return <Solution {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	},
	getNavItem(model) {
		const questions = model.parent.children.models.filter(
			child => child.get('type') === 'ObojoboDraft.Chunks.Question'
		)
		const label = model.title || `Question ${questions.indexOf(model) + 1}`

		return {
			type: 'sub-link',
			label,
			path: [`#obo-${model.get('id')}`]
		}
	}
}

export default Question
