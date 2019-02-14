import { Block } from 'slate'
import { CHILD_REQUIRED } from 'slate-schema-violations'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const schema = {
	blocks: {
		'oboeditor.component': {
			nodes: [
				{
					match: [
						{ type: 'ObojoboDraft.Chunks.ActionButton' },
						{ type: 'ObojoboDraft.Chunks.Break' },
						{ type: 'ObojoboDraft.Chunks.Code' },
						{ type: 'ObojoboDraft.Chunks.Figure' },
						{ type: 'ObojoboDraft.Chunks.Heading' },
						{ type: 'ObojoboDraft.Chunks.HTML' },
						{ type: 'ObojoboDraft.Chunks.IFrame' },
						{ type: 'ObojoboDraft.Chunks.List' },
						{ type: 'ObojoboDraft.Chunks.MathEquation' },
						{ type: 'ObojoboDraft.Chunks.Table' },
						{ type: 'ObojoboDraft.Chunks.Text' },
						{ type: 'ObojoboDraft.Chunks.YouTube' },
						{ type: 'ObojoboDraft.Chunks.QuestionBank' },
						{ type: 'ObojoboDraft.Chunks.Question' }
					],
					min: 1,
					max: 1
				}
			],
			normalize: (editor, error) => {
				const { node, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: TEXT_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					// Change to a constant when slate-schema-violations updates
					case 'child_max_invalid': {
						return editor.splitNodeByKey(node.key, 1)
					}
				}
			}
		}
	}
}

export default schema
