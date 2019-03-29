import { Block } from 'slate'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'upper-alpha', 'upper-roman', 'lower-alpha', 'lower-roman']

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.List': {
			nodes: [
				{
					match: [{ type: LIST_LEVEL_NODE }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				// find type and bullet style
				const type = node.data.get('content').listStyles.type
				const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets

				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						// Allow inserting of new nodes by unwrapping unexpected blocks at end and beginning
						const isAtEdge = index === node.nodes.size - 1 || index === 0
						if (child.object === 'block' && isAtEdge && child.type !== LIST_LINE_NODE) {
							return editor.unwrapNodeByKey(child.key)
						}

						return editor.wrapBlockByKey(child.key, {
							type: LIST_LEVEL_NODE,
							data: { content: { type: type, bulletStyle: bulletList[0] } }
						})
					}
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: LIST_LEVEL_NODE,
							data: { content: { type: type, bulletStyle: bulletList[0] } }
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.List.Level': {
			nodes: [
				{
					match: [{ type: LIST_LEVEL_NODE }, { type: LIST_LINE_NODE }],
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

						return editor
							.wrapBlockByKey(child.key, {
								type: LIST_LINE_NODE
							})
							.moveToStartOfNextText()
					}
					case CHILD_MIN_INVALID: {
						const block = Block.create(LIST_LINE_NODE)
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.List.Line': {
			nodes: [{ match: [{ object: 'text' }] }]
		}
	}
}

export default schema
