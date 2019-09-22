import React from 'react'

import emptyNode from './empty-node.json'
import Icon from './icon'
import Node from './editor-component'
import Settings from './components/settings/editor-component'
import Schema from './schema'
import Converter from './converter'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'

const QuestionBank = {
	name: QUESTION_BANK_NODE,
	menuLabel: 'Question Bank',
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
				case QUESTION_BANK_NODE:
					return <Node {...props} {...props.attributes} />
				case SETTINGS_NODE:
					return <Settings {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: Schema
	}
}

export default QuestionBank
