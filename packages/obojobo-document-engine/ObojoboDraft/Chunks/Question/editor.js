import React from 'react'
import Common from 'Common'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Solution from './components/solution/editor-component'
import Schema from './schema'
import Converter from './converter'

const plugins = {
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
}

Common.Store.registerEditorModel('ObojoboDraft.Chunks.Question', {
	name: 'Question',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins
})

const Question = {
	name: QUESTION_NODE,
	components: {
		Node,
		Solution,
		Icon
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default Question
