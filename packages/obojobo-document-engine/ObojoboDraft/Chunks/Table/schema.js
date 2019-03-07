import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Table': {
			nodes: [
				{
					match: [{ type: TABLE_ROW_NODE }],
					min: 1
				}
			],
			normalize: (change, error) => {
				const { node, child, index } = error
				const header = index === 0 && node.data.get('content').header
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return change.unwrapNodeByKey(child.key)
						}

						// If a block was inserted in the middle, delete it to maintain table shape
						if (child.object === 'block') {
							return change.removeNodeByKey(child.key)
						}

						return change.wrapBlockByKey(child.key, {
							type: TABLE_ROW_NODE,
							data: { content: { header } }
						})
					}
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: TABLE_ROW_NODE,
							data: { content: { header } }
						})
						return change.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Table.Row': {
			nodes: [
				{
					match: [{ type: TABLE_CELL_NODE }],
					min: 1
				}
			],
			normalize: (change, error) => {
				const { node, child, index } = error
				const header = node.data.get('content').header
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return change.unwrapNodeByKey(child.key)
						}

						// If a block was inserted in the middle, delete it to maintain table shape
						if (child.object === 'block') {
							return change.removeNodeByKey(child.key)
						}

						return change.wrapBlockByKey(child.key, {
							type: TABLE_CELL_NODE,
							data: { content: { header } }
						})
					}
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: TABLE_CELL_NODE,
							data: { content: { header } }
						})
						return change.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Table.Cell': {
			nodes: [{ match: [{ object: 'text' }] }],
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return change.unwrapNodeByKey(child.key)
						}
					}
				}
			}
		}
	}
}

export default schema
