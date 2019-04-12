import { Block } from 'slate'

import TextParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_MIN_INVALID } = SchemaViolations

const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'
const TEXT_PARAMETER = 'oboeditor.text-parameter'

const schema = {
	blocks: {
		'ObojoboDraft.Sections.Assessment.Rubric': {
			nodes: [
				{
					match: [{ type: TEXT_PARAMETER }],
					min: 4,
					max: 4
				},
				{
					match: [{ type: MOD_LIST_NODE }]
				}
			],
			normalize: (editor, error) => {
				const { node, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						let block
						switch (index) {
							case 0:
								block = Block.create(
									TextParameter.helpers.oboToSlate(
										'passingAttemptScore',
										'100',
										'Passing Score'
									)
								)
								break
							case 1:
								block = Block.create(
									TextParameter.helpers.oboToSlate(
										'passedResult',
										'100',
										'Passed Result'
									)
								)
								break
							case 2:
								block = Block.create(
									TextParameter.helpers.oboToSlate(
										'failedResult',
										'0',
										'Failed Result'
									)
								)
								break
							case 3:
								block = Block.create(
									TextParameter.helpers.oboToSlate(
										'unableToPassResult',
										'',
										'Unable to Pass Result'
									)
								)
								break
						}
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Sections.Assessment.Rubric.ModList': {
			nodes: [
				{
					match: [{ type: MOD_NODE }],
					min: 1,
					max: 20
				}
			],
			normalize: (editor, error) => {
				const { node, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: MOD_NODE,
							nodes: [
								{

								}
							]
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Sections.Assessment.Rubric.Mod': {
			nodes: [
				{ match: [{ type:  TEXT_PARAMETER }], min: 2 }
			],
			normalize: (editor, error) => {
				const { node, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						if (index === 0) {
							const block = Block.create(
								TextParameter.helpers.oboToSlate(
									'attemptCondition',
									'[1,$last_attempt]',
									'Attempt Condition'
								)
							)
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							TextParameter.helpers.oboToSlate(
								'reward',
								'0',
								'Reward'
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
