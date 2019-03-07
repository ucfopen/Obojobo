import { Block } from 'slate'

import SchemaViolations from '../../../src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Text': {
			nodes: [
				{
					match: [{ type: TEXT_LINE_NODE }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Deal with Paste insertion of top-level nodes
						if (child.type === 'oboeditor.component') {
							return editor.unwrapNodeByKey(child.key)
						}

						// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
						const isAtEdge = index === node.nodes.size - 1 || index === 0
						if (child.object === 'block' && isAtEdge) {
							return editor.unwrapNodeByKey(child.key)
						}

						return editor.wrapBlockByKey(child.key, {
							type: TEXT_LINE_NODE,
							data: { indent: 0 }
						})
					}
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: TEXT_LINE_NODE,
							data: { indent: 0 }
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Text.TextLine': {
			nodes: [{ match: [{ object: 'text' }] }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
						const isAtEdge = index === node.nodes.size - 1 || index === 0
						if (child.object === 'block' && isAtEdge) {
							return editor.unwrapNodeByKey(child.key)
						}
					}
				}
			}
		}
	}
}

export default schema
