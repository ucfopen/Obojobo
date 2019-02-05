import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

// Default node type
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const EditorSchema = {
	schema: {
		document: {
			nodes: [
				{
					match: [{ type: 'oboeditor.component' }, { type: 'ObojoboDraft.Sections.Assessment' }],
					min: 1
				}
			],
			normalize: (change, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
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
						return change.insertNodeByKey(node.key, index, block)
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
						return change.withoutNormalizing(c => {
							c.removeNodeByKey(child.key)
							return c.insertNodeByKey(node.key, index, block)
						})
					}
				}
			}
		}
	}
}

export default EditorSchema
