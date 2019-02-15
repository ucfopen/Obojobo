import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const SETTINGS_NODE = 'ObojoboDraft.Chunks.MCAssessment.Settings'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.MCAssessment': {
			nodes: [
				{
					match: [{ type: CHOICE_LIST_NODE }],
					min: 1
				},
				{
					match: [{ type: SETTINGS_NODE }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				console.log('MCAssessment', error)
				const { node, child, index } = error
				switch (error.code) {
					case 'child_max_invalid': {
						const { index, count, limit, node, rule } = error
						console.log('details to follow ', index, count, limit,
							JSON.stringify(node.toJSON()), rule)
						break;
					}
					case 'child_min_invalid': {
						if (index === 0) {
							const block = Block.create({
								type: CHOICE_LIST_NODE
							})
							return editor.insertNodeByKey(node.key, index, block)
						}

						const block = Block.create({
							type: SETTINGS_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_REQUIRED: {
						if (index === 0) {
							const block = Block.create({
								type: CHOICE_LIST_NODE
							})
							return editor.insertNodeByKey(node.key, index, block)
						}

						const block = Block.create({
							type: SETTINGS_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						if (index === 0) {
							const block = Block.create({
								type: CHOICE_LIST_NODE
							})
							return editor.wrapBlockByKey(child.key, block)
						}

						const block = Block.create({
							type: SETTINGS_NODE
						})
						return editor.wrapBlockByKey(child.key, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.MCAssessment.ChoiceList': {
			nodes: [
				{
					match: [{ type: MCCHOICE_NODE }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				console.log('MCChoiceList', error)
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: MCCHOICE_NODE,
							data: { content: { score: 0 } }
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						const block = Block.create({
							type: MCCHOICE_NODE,
							data: { content: { score: 0 } }
						})
						return editor.wrapBlockByKey(child.key, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.MCAssessment.Settings': {
			nodes: [
				{
					match: [{ type: 'Parameter' }],
					min: 2
				}
			],
			normalize: (editor, error) => {
				console.log('MCSettings', error)
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						if (index === 0) {
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'responseType',
									value: 'Pick One',
									display: 'Response Type',
									options: ['pick-one', 'pick-all']
								})
							)
							return editor.insertNodeByKey(node.key, index, block)
						}
						const block = Block.create(
							ParameterNode.helpers.oboToSlate({
								name: 'shuffle',
								value: true,
								display: 'Shuffle',
								checked: true
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
										name: 'responseType',
										value: 'Pick One',
										display: 'Response Type',
										options: ['pick-one', 'pick-all']
									})
								)
								return c.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'shuffle',
									value: true,
									display: 'Shuffle',
									checked: true
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
