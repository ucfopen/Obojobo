import { Block } from 'slate'

import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations
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
						if (child.object === 'block') {
							return editor.unwrapNodeByKey(child.key)
						}

						return editor.wrapBlockByKey(child.key, {
							type: CODE_LINE_NODE,
							data: { content: { indent: 0 } }
						})
					}
					case CHILD_MIN_INVALID: {
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
			nodes: [{ match: [{ object: 'text' }] }],
			normalize: (editor, error) => {
				const { child } = error
				switch (error.code) {
					case CHILD_TYPE_INVALID: {
						if (child.object === 'block') {
							return editor.unwrapNodeByKey(child.key)
						}
					}
				}
			}
		}
	}
}

export default schema
