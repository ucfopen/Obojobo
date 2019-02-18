import { Block } from 'slate'
import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

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
			normalize: (editor, error) => {
				const { node, child, index } = error
				switch (error.code) {
					case 'child_min_invalid': {
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

export default EditorSchema
