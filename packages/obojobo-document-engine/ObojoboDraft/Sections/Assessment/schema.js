import { Block } from 'slate'

import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'
import SchemaViolations from '../../../src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const schema = {
	blocks: {
		'ObojoboDraft.Sections.Assessment': {
			nodes: [
				{ match: [{ type: SETTINGS_NODE }], min: 1 },
				{ match: [{ type: PAGE_NODE }], min: 1 },
				{ match: [{ type: QUESTION_BANK_NODE }], min: 1 },
				{ match: [{ type: ACTIONS_NODE }], min: 1 },
				{ match: [{ type: RUBRIC_NODE }] }
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						let block
						switch (index) {
							case 0:
								block = Block.create({
									type: SETTINGS_NODE
								})
								break
							case 1:
								block = Block.create({
									type: PAGE_NODE
								})
								break
							case 2:
								block = Block.create({
									type: QUESTION_BANK_NODE,
									data: { content: { choose: 1, select: 'sequential' } }
								})
								break
							case 3:
								block = Block.create({
									type: ACTIONS_NODE
								})
								break
						}
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						switch (index) {
							case 0:
								return editor.wrapBlockByKey(child.key, {
									type: SETTINGS_NODE
								})
							case 1:
								return editor.wrapBlockByKey(child.key, {
									type: PAGE_NODE
								})
							case 2:
								return editor.wrapBlockByKey(child.key, {
									type: QUESTION_BANK_NODE,
									data: { content: { choose: 1, select: 'sequential' } }
								})
							case 3:
								return editor.wrapBlockByKey(child.key, {
									type: ACTIONS_NODE
								})
						}
					}
				}
			}
		},
		'ObojoboDraft.Sections.Assessment.Settings': {
			nodes: [{ match: [{ type: 'Parameter' }], min: 2 }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						if (index === 0) {
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'attempts',
									value: 'unlimited',
									display: 'Attempts'
								})
							)
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							ParameterNode.helpers.oboToSlate({
								name: 'review',
								value: 'never',
								display: 'Review',
								options: ['always', 'never', 'no-attempts-remaining']
							})
						)
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return editor.withoutNormalizing(c => {
							c.removeNodeByKey(child.key)
							if (index === 0) {
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'attempts',
										value: 'unlimited',
										display: 'Attempts'
									})
								)
								return c.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'review',
									value: 'never',
									display: 'Review',
									options: ['always', 'never', 'no-attempts-remaining']
								})
							)
							return c.insertNodeByKey(node.key, index, block)
						})
					}
				}
			}
		}
	}
}

export default schema
