import { Block } from 'slate'

import ParameterNode from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

const schema = {
	blocks: {
		'ObojoboDraft.Sections.Assessment.Rubric': {
			nodes: [{ match: [{ type: 'Parameter' }], min: 4 }, { match: [{ type: MOD_LIST_NODE }] }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						let block
						switch (index) {
							case 0:
								block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'passingAttemptScore',
										value: '100',
										display: 'Passing Score'
									})
								)
								break
							case 1:
								block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'passedResult',
										value: '100',
										display: 'Passed Result'
									})
								)
								break
							case 2:
								block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'failedResult',
										value: '0',
										display: 'Failed Result'
									})
								)
								break
							case 3:
								block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'unableToPassResult',
										value: '',
										display: 'Unable to Pass Result'
									})
								)
								break
						}
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return editor.withoutNormalizing(c => {
							c.removeNodeByKey(child.key)
							let block
							switch (index) {
								case 0:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'passingAttemptScore',
											value: '100',
											display: 'Passing Score'
										})
									)
									break
								case 1:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'passedResult',
											value: '100',
											display: 'Passed Result'
										})
									)
									break
								case 2:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'failedResult',
											value: '0',
											display: 'Failed Result'
										})
									)
									break
								case 3:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'unableToPassResult',
											value: '',
											display: 'Unable to Pass Result'
										})
									)
									break
							}
							return editor.insertNodeByKey(node.key, index, block)
						})
					}
				}
			}
		},
		'ObojoboDraft.Sections.Assessment.Rubric.ModList': {
			nodes: [{ match: [{ type: MOD_NODE }], min: 1 }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: MOD_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return editor.wrapBlockByKey(child.key, {
							type: MOD_NODE
						})
					}
				}
			}
		},
		'ObojoboDraft.Sections.Assessment.Rubric.Mod': {
			nodes: [{ match: [{ type: 'Parameter' }], min: 2 }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						if (index === 0) {
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'attemptCondition',
									value: '[1,$last_attempt]',
									display: 'Attempt Condition'
								})
							)
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							ParameterNode.helpers.oboToSlate({
								name: 'reward',
								value: '0',
								display: 'Reward'
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
										name: 'attemptCondition',
										value: '[1,$last_attempt]',
										display: 'Attempt Condition'
									})
								)
								return c.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'reward',
									value: '0',
									display: 'Reward'
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
