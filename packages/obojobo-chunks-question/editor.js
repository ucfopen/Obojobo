import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common/index'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Solution from './components/solution/editor-component'
import Schema from './schema'
import Converter from './converter'

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case QUESTION_NODE:
				return <Node {...props} {...props.attributes} />
			case SOLUTION_NODE:
				return <Solution {...props} {...props.attributes} />
		}
	},
	schema: Schema
}

Common.Registry.registerModel('ObojoboDraft.Chunks.Question', {
	name: 'Question',
	icon: Icon,
	isInsertable: true,
	insertJSON: emptyNode,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	plugins,
	getNavItem(model) {
		let label
		const questions = model.parent.children.models.filter(
			child => child.get('type') === 'ObojoboDraft.Chunks.Question'
		)

		if (model.title) {
			label = model.title
		} else if (model.modelState.mode === 'practice') {
			label = `Practice Question ${questions.indexOf(model) + 1}`
		} else {
			label = `Question ${questions.indexOf(model) + 1}`
		}

		return {
			type: 'sub-link',
			label,
			path: [`#obo-${model.get('id')}`]
		}
	}
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
