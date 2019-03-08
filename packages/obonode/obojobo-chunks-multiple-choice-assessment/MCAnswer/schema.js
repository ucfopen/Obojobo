import { Block } from 'slate'

import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.MCAssessment.MCAnswer': {
			nodes: [{ match: [{ type: 'oboeditor.component' }], min: 1 }],
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_MIN_INVALID: {
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
		}
	}
}

export default schema
