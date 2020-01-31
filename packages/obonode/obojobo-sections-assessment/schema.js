import { Block } from 'slate'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const schema = {
	blocks: {
		'ObojoboDraft.Sections.Assessment': {
			nodes: [
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
									type: PAGE_NODE
								})
								break
							case 1:
								block = Block.create({
									type: QUESTION_BANK_NODE,
									data: { content: { choose: 1, select: 'sequential' } }
								})
								break
							case 2:
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
									type: PAGE_NODE
								})
							case 1:
								return editor.wrapBlockByKey(child.key, {
									type: QUESTION_BANK_NODE,
									data: { content: { choose: 1, select: 'sequential' } }
								})
							case 2:
								return editor.wrapBlockByKey(child.key, {
									type: ACTIONS_NODE
								})
						}
					}
				}
			}
		}
	}
}

export default schema
