import { Block } from 'slate'

import TextParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter'
import SelectParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/select-parameter'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_PARAMETER = 'oboeditor.text-parameter'
const SELECT_PARAMETER = 'oboeditor.select-parameter'

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
			nodes: [
				{
					match: [{ type: TEXT_PARAMETER }],
					min: 1,
					max: 1
				},
				{
					match: [{ type: SELECT_PARAMETER }],
					min: 1,
					max: 1
				}
			],
			normalize: (editor, error) => {
				const { node, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						if (index === 0) {
							const block = Block.create(
								TextParameter.helpers.oboToSlate(
									'attempts',
									'unlimited',
									'Attempts'
								)
							)
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							SelectParameter.helpers.oboToSlate(
								'review',
								'never',
								'Review',
								['always', 'never', 'no-attempts-remaining']
							)
						)
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		}
	}
}

export default schema
