import { Block } from 'slate'

import ParameterNode from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

import emptyQuestion from 'obojobo-chunks-question/empty-node.json'

const SELECT_TYPES = ['sequential', 'random', 'random-unseen']

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.QuestionBank': {
			nodes: [
				{ match: [{ type: SETTINGS_NODE }], min: 1 },
				{ match: [{ type: QUESTION_NODE }, { type: QUESTION_BANK_NODE }], min: 1 }
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						if (index === 0) {
							const block = Block.create({
								type: SETTINGS_NODE
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(emptyQuestion)
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						if (index === 0) {
							const block = Block.create({
								type: SETTINGS_NODE
							})
							return editor.wrapBlockByKey(child.key, block)
						}
						return editor.wrapBlockByKey(child.key, {
							type: QUESTION_NODE
						})
					}
				}
			}
		},
		'ObojoboDraft.Chunks.QuestionBank.Settings': {
			nodes: [
				{
					match: [
						{
							type: 'Parameter'
						}
					],
					min: 2
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						if (index === 0) {
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'choose',
									value: 'Infinity',
									display: 'Choose'
								})
							)
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							ParameterNode.helpers.oboToSlate({
								name: 'select',
								value: 'sequential',
								display: 'Select',
								options: SELECT_TYPES
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
										name: 'choose',
										value: 'Infinity',
										display: 'Choose'
									})
								)
								return c.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'select',
									value: 'sequential',
									display: 'Select',
									options: SELECT_TYPES
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
