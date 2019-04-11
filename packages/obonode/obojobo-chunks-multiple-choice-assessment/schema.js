import { Block } from 'slate'

import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.MCAssessment': {
			nodes: [
				{
					match: [{ type: MCCHOICE_NODE }],
					min: 1
				}
			],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
						const block = Block.create({
							type: MCCHOICE_NODE,
							data: { content: { score: 0 } }
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						const block = Block.create({
							type: MCCHOICE_NODE,
							data: { content: { score: 0 } }
						})
						return editor.wrapBlockByKey(child.key, block)
					}
				}
			}
		}
	}
}

export default schema
