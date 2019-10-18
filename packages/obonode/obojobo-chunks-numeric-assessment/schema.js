import { Block } from 'slate'

import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
import {
	NUMERIC_ASSESSMENT_NODE,
	NUMERIC_ANSWER_NODE,
	NUMERIC_FEEDBACK_NODE,
	NUMERIC_CHOICE_NODE
} from './constants'
const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const schema = {
	blocks: {
		[NUMERIC_ANSWER_NODE]: {
			isVoid: true
		},
		[NUMERIC_CHOICE_NODE]: {
			nodes: [
				{
					match: [{ type: NUMERIC_ANSWER_NODE }],
					min: 1
				},
				{
					match: [{ type: NUMERIC_FEEDBACK_NODE }]
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: NUMERIC_ANSWER_NODE,
							isVoid: true,
							data: {
								numericChoice: {
									requirement: 'exact',
									answer: '',
									score: 100
								}
							}
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						// extra children will be deleted by slate defaults
						if (index >= 2) return
						// multiple answers and feedbacks will be deleted by slate defaults
						if (index === 1 && child.type !== NUMERIC_FEEDBACK_NODE) return
						return editor.wrapBlockByKey(child.key, {
							type: NUMERIC_ANSWER_NODE,
							isVoid: true,
							data: {
								numericChoice: {
									requirement: 'exact',
									answer: '',
									score: 100
								}
							}
						})
					}
				}
			}
		},
		[NUMERIC_ASSESSMENT_NODE]: {
			nodes: [{ match: [{ type: NUMERIC_CHOICE_NODE }], min: 1 }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							object: 'block',
							type: NUMERIC_CHOICE_NODE,
							nodes: []
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						const block = Block.fromJSON({
							object: 'block',
							type: NUMERIC_CHOICE_NODE,
							nodes: []
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

export default schema
