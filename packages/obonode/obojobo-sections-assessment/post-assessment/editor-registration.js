import React from 'react'
import { Block } from 'slate'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
import PostAssessment from './editor-component'
import Converter from './converter'
import PostAssessmentScore from './post-assessment-score'

const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case SCORE_NODE:
				return <PostAssessmentScore {...props} {...props.attributes} />
			case ACTIONS_NODE:
				return <PostAssessment {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Sections.Assessment.ScoreActions': {
				nodes: [{ match: [{ type: SCORE_NODE }], min: 1 }],
				normalize: (editor, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_MIN_INVALID: {
							const block = Block.create({
								type: SCORE_NODE,
								data: { for: '[0,100]' }
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return editor.wrapBlockByKey(child.key, {
								type: SCORE_NODE,
								data: { for: '[0,100]' }
							})
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.ScoreAction': {
				nodes: [{ match: [{ type: PAGE_NODE }], min: 1 }],
				normalize: (editor, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_MIN_INVALID: {
							const block = Block.create({
								type: PAGE_NODE
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return editor.wrapBlockByKey(child.key, {
								type: PAGE_NODE
							})
						}
					}
				}
			}
		}
	}
}

const Actions = {
	name: SCORE_NODE,
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins
}

export default Actions
