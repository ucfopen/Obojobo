import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import ParameterNode from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node'

const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.QuestionBank': {
			nodes: [
				{ match: [{ type: SETTINGS_NODE }], min: 1, max: 1 },
				{ match: [{ type: QUESTION_NODE }, { type: QUESTION_BANK_NODE }], min: 1 }
			],
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						if (index === 0) {
							const block = Block.create({
								type: SETTINGS_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create({
							type: QUESTION_NODE
						})
						return change.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						if (index === 0) {
							const block = Block.create({
								type: SETTINGS_NODE
							})
							return change.wrapBlockByKey(child.key, block)
						}
						return change.wrapBlockByKey(child.key, {
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
					min: 2,
					max: 2
				}
			],
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						if (index === 0) {
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'choose',
									value: Infinity + '',
									display: 'Choose'
								})
							)
							return change.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							ParameterNode.helpers.oboToSlate({
								name: 'select',
								value: 'sequential',
								display: 'Select',
								options: ['sequential', 'random', 'random-unseen']
							})
						)
						return change.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return change.withoutNormalization(c => {
							c.removeNodeByKey(child.key)
							if (index === 0) {
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'choose',
										value: Infinity + '',
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
									options: ['sequential', 'random', 'random-unseen']
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
