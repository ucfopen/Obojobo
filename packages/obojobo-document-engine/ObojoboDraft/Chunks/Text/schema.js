import { Block } from 'slate'
import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

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
					case 'child_min_invalid': {
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
