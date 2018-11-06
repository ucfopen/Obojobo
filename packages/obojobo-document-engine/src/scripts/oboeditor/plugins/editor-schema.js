import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

// Default node type
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

// Placeholder array until EditorStore is implemented
const nodes = [
	'ObojoboDraft.Chunks.ActionButton',
	'ObojoboDraft.Chunks.Break',
	'ObojoboDraft.Chunks.Code',
	'ObojoboDraft.Chunks.Figure',
	'ObojoboDraft.Chunks.Heading',
	'ObojoboDraft.Chunks.HTML',
	'ObojoboDraft.Chunks.IFrame',
	'ObojoboDraft.Chunks.List',
	'ObojoboDraft.Chunks.MathEquation',
	'ObojoboDraft.Chunks.MCAssessment',
	'ObojoboDraft.Chunks.Table',
	'ObojoboDraft.Chunks.Text',
	'ObojoboDraft.Chunks.YouTube',
	'ObojoboDraft.Chunks.QuestionBank',
	'ObojoboDraft.Chunks.Question',
	'ObojoboDraft.Sections.Assessment',
	'ObojoboDraft.Pages.Page'
]

const EditorSchema = {
	schema: {
		document: {
			nodes: [{ match: nodes.map(chunk => ({type: chunk})), min: 1 }],
			normalize: (change, error) => {
				const { node, child, index } = error

				switch (error.code) {
					case CHILD_REQUIRED: 
						return change.insertNodeByKey(node.key, index, {
							object: 'block',
							type: TEXT_NODE
						})
					case CHILD_TYPE_INVALID:
						return change.wrapBlockByKey(child.key, {
							object: 'block',
							type: TEXT_NODE
						})
				}
			}
		}
	}
}

export default EditorSchema
