import { Block } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

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
								type: SETTINGS_NODE,
								data: {
									content: {
										choose: '1',
										chooseAll: true,
										select: 'sequential'
									}
								}
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
						const Question = Common.Registry.getItemForType(QUESTION_NODE)
						const block = Block.create(Question.insertJSON)
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						if (index === 0) {
							const block = Block.create({
								type: SETTINGS_NODE,
								data: {
									content: {
										choose: '1',
										chooseAll: true,
										select: 'sequential'
									}
								}
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
			isVoid: true
		}
	}
}

export default schema
