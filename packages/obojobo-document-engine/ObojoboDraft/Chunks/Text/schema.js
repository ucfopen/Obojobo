import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

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
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
						const isAtEdge = index === node.nodes.size - 1 || index === 0
						if (child.object === 'block' && isAtEdge) {
							return change.unwrapNodeByKey(child.key)
						}

						return change.wrapBlockByKey(child.key, {
							type: TEXT_LINE_NODE,
							data: { indent: 0 }
						})
					}
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: TEXT_LINE_NODE,
							data: { indent: 0 }
						})
						return change.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Text.TextLine': {
			nodes: [{ match: [{ object: 'text' }] }],
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
						const isAtEdge = index === node.nodes.size - 1 || index === 0
						if (child.object === 'block' && isAtEdge) {
							return change.unwrapNodeByKey(child.key)
						}
					}
				}
			}
		}
	}
}

export default schema
