import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.MCAssessment.MCChoice': {
			nodes: [
				{
					match: [{ type: MCANSWER_NODE }],
					min: 1
				},
				{
					match: [{ type: MCFEEDBACK_NODE }]
				}
			],
			normalize: (editor, error) => {
				console.log('MCChoice', error)
				const { node, child, index } = error
				switch (error.code) {
					case CHILD_REQUIRED: {
						const block = Block.create({
							type: MCANSWER_NODE
						})
						return editor.insertNodeByKey(node.key, index, block)
					}
					case CHILD_TYPE_INVALID: {
						// extra children will be deleted by slate defaults
						if (index >= 2) return
						// multiple answers and feedbacks will be deleted by slate defaults
						if (index === 1 && child.type !== MCFEEDBACK_NODE) return
						return editor.wrapBlockByKey(child.key, {
							type: MCANSWER_NODE
						})
					}
				}
			}
		}
	}
}

export default schema
