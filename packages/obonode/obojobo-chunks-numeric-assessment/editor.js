import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import Converter from './converter'
import Node from './editor-component'
import NumericAnswer from './components/numeric-answer/editor-component'
import NumericChoice from './components/numeric-choice/editor-component'
import Schema from './schema'

import { Block } from 'slate'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
import FeedbackNode from './NumericFeedback/editor-component'
import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'

import {
	NUMERIC_ANSWER_NODE,
	NUMERIC_ASSESSMENT_NODE,
	NUMERIC_CHOICE_NODE,
	NUMERIC_FEEDBACK_NODE
} from './constants'

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case NUMERIC_ASSESSMENT_NODE:
				return <Node {...props} {...props.attributes} />
			case NUMERIC_ANSWER_NODE:
				return <NumericAnswer {...props} {...props.attributes} />
			case NUMERIC_CHOICE_NODE:
				return <NumericChoice {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

Common.Registry.registerModel(NUMERIC_ASSESSMENT_NODE, {
	name: 'Numeric Assessment',
	isInsertable: false,
	slateToObo: Converter.slateToObo,
	oboToSlate: Converter.oboToSlate,
	supportsChildren: false,
	plugins
})

const feedbackSchema = {
	blocks: {
		'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback': {
			nodes: [
				{
					match: [
						{ type: 'ObojoboDraft.Chunks.ActionButton' },
						{ type: 'ObojoboDraft.Chunks.Break' },
						{ type: 'ObojoboDraft.Chunks.Code' },
						{ type: 'ObojoboDraft.Chunks.Figure' },
						{ type: 'ObojoboDraft.Chunks.Heading' },
						{ type: 'ObojoboDraft.Chunks.HTML' },
						{ type: 'ObojoboDraft.Chunks.IFrame' },
						{ type: 'ObojoboDraft.Chunks.List' },
						{ type: 'ObojoboDraft.Chunks.MathEquation' },
						{ type: 'ObojoboDraft.Chunks.Table' },
						{ type: 'ObojoboDraft.Chunks.Text' },
						{ type: 'ObojoboDraft.Chunks.YouTube' }
					],
					min: 1
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							object: 'block',
							type: TEXT_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						const block = Block.fromJSON({
							object: 'block',
							type: TEXT_NODE
						})
						return editor.withoutNormalizing(c => {
							c.removeNodeByKey(child.key)
							return c.insertNodeByKey(node.key, index, block)
						})
					}
				}
			}
		}
	}
}

const fbSlateToObo = node => {
	console.log('s2o', node.type)
	return {
		id: node.key,
		type: node.type,
		children: node.nodes.map(child => Component.helpers.slateToObo(child)),
		content: node.data.get('content') || {}
	}
}

Common.Registry.registerModel(NUMERIC_FEEDBACK_NODE, {
	name: NUMERIC_FEEDBACK_NODE,
	menuLabel: 'Numeric Feedback',
	isInsertable: false,
	// slateToObo: Converter.slateToObo,
	// oboToSlate: Converter.oboToSlate,
	// helpers: Converter,
	supportsChildren: true,
	helpers: {
		slateToObo: fbSlateToObo,
		oboToSlate: node => ({
			object: 'block',
			key: node.id,
			type: node.type,
			nodes: node.children.map(child => Component.helpers.oboToSlate(child)),
			data: {
				content: node.content
			}
		})
	},
	plugins: {
		renderNode(props, editor, next) {
			switch (props.node.type) {
				case NUMERIC_FEEDBACK_NODE:
					return <FeedbackNode {...props} {...props.attributes} />
				default:
					return next()
			}
		},
		schema: feedbackSchema
	}
})

const NumericAssessment = {
	components: {
		Node,
		NumericAnswer,
		NumericChoice
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default NumericAssessment
