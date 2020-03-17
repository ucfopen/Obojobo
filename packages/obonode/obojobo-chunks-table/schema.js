import { Block } from 'slate'

import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'
const TABLE_CAPTION_NODE = 'ObojoboDraft.Chunks.Table.Caption'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Table': {
			nodes: [
				{
					match: [{ type: TABLE_CAPTION_NODE }],
					min: 1,
					max: 1
				},
				{
					match: [{ type: TABLE_ROW_NODE }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				const header = index === 0 && node.data.get('content').header
				const numCols = node.data.get('content').numCols

				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return editor.unwrapNodeByKey(child.key)
						}

						// If a block was inserted in the middle, delete it to maintain table shape
						if (child.object === 'block') {
							return editor.removeNodeByKey(child.key)
						}

						return editor.wrapBlockByKey(child.key, {
							type: TABLE_ROW_NODE,
							data: { content: { header, numCols } }
						})
					}

					case CHILD_MIN_INVALID: {
						if (
							error.node.nodes.size === 0 ||
							error.node.nodes.get(0).type !== TABLE_CAPTION_NODE
						) {
							const block = Block.create({
								type: TABLE_CAPTION_NODE,
								data: { content: { header, numCols } }
							})
							return editor.insertNodeByKey(node.key, index, block)
						} else {
							const block = Block.create({
								type: TABLE_ROW_NODE,
								data: { content: { header, numCols } }
							})
							return editor.insertNodeByKey(node.key, index, block)
						}
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
			normalize: (editor, error) => {
				const { node, child, index } = error
				const header = node.data.get('content').header
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return editor.unwrapNodeByKey(child.key)
						}

						// If a block was inserted in the middle, delete it to maintain table shape
						if (child.object === 'block') {
							return editor.removeNodeByKey(child.key)
						}

						return editor.wrapBlockByKey(child.key, {
							type: TABLE_CELL_NODE,
							data: { content: { header } }
						})
					}
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: TABLE_CELL_NODE,
							data: { content: { header } }
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		[TABLE_CAPTION_NODE]: {
			nodes: [{ match: [{ object: 'text' }] }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return editor.unwrapNodeByKey(child.key)
						}
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Table.Cell': {
			nodes: [{ match: [{ object: 'text' }] }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end
						if (child.object === 'block' && index === node.nodes.size - 1) {
							return editor.unwrapNodeByKey(child.key)
						}
					}
				}
			}
		}
	}
}

export default schema
