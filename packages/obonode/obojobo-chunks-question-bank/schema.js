import { Block } from 'slate'

import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

import emptyQuestion from 'obojobo-chunks-question/empty-node.json'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.QuestionBank': {
			nodes: [
				{ match: [{ type: QUESTION_NODE }, { type: QUESTION_BANK_NODE }], min: 1 }
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create(emptyQuestion)
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return editor.wrapBlockByKey(child.key, {
							type: QUESTION_NODE
						})
					}
				}
			}
		}
	}
}

export default schema
