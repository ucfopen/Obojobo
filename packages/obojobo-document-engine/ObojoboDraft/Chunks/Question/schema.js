import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Question': {
			nodes: [
				{ match: [ { type: 'oboeditor.component' } ], min: 1 },
				{ match: [MCASSESSMENT_NODE], min: 1, max: 1 },
				{ match: [SOLUTION_NODE], max: 1 }
			],

			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						// If we are missing the last node,
						// it should be a MCAssessment
						if (index === node.nodes.size) {
							const block = Block.create({
								type: MCASSESSMENT_NODE,
								data: { content: { responseType: 'pick-one', shuffle: true } }
							})
							return change.insertNodeByKey(node.key, index, block)
						}

						// Otherwise, just add a text node
						const block = Block.create({
							object: 'block',
							type: 'oboeditor.component',
							nodes: [
								{
									object: 'block',
									type: TEXT_NODE
								}
							]
						})
						return change.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						if (child.object !== 'text') return
						const block = Block.fromJSON({
							object: 'block',
							type: 'oboeditor.component',
							nodes: [
								{
									object: 'block',
									type: TEXT_NODE
								}
							]
						})
						return change.withoutNormalization(c => {
							c.removeNodeByKey(child.key)
							return c.insertNodeByKey(node.key, index, block)
						})
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Question.Solution': {
			nodes: [
				{
					match: [{ type: PAGE_NODE }],
					min: 1,
					max: 1
				}
			],
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: PAGE_NODE
						})
						return change.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return change.wrapBlockByKey(child.key, {
							type: PAGE_NODE
						})
					}
				}
			}
		}
	}
}

export default schema
