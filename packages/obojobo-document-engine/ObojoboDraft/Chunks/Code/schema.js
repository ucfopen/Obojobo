import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Code': {
			nodes: [
				{
					match: [{ type: CODE_LINE_NODE }],
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
							type: CODE_LINE_NODE,
							data: { content: { indent: 0 } }
						})
					}
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: CODE_LINE_NODE,
							data: { content: { indent: 0 } }
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
				}
			}
		},
		'ObojoboDraft.Chunks.Code.CodeLine': {
			nodes: [
				{
					match: [{ object: 'text' }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				console.log('here?')
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
