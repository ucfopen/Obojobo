import { Block } from 'slate'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
import emptyAssessment from './empty-assessment.json'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const NUMERIC_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.NumericAssessment'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Question': {
			nodes: [
				{ match: [{ type: 'oboeditor.component' }], min: 1 },
				{ match: [MCASSESSMENT_NODE, NUMERIC_ASSESSMENT_NODE], min: 1 },
				{ match: [SOLUTION_NODE] }
			],

			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						// If we are missing the last node,
						// it should be a MCAssessment
						if (index === node.nodes.size) {
							const block = Block.create(emptyAssessment)
							return editor.insertNodeByKey(node.key, index, block)
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
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
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
						return editor.withoutNormalizing(c => {
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
					min: 1
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: PAGE_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						return editor.wrapBlockByKey(child.key, {
							type: PAGE_NODE
						})
					}
				}
			}
		}
	}
}

export default schema
