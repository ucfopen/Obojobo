import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID } = SchemaViolations

import Schema from './schema'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

describe('Figure Schema', () => {
	test('data checks for content', () => {
		expect(Schema.blocks[FIGURE_NODE].data.content('mockContent')).toEqual(true)
	})
	test('normalize fixes invalid data', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		Schema.blocks[FIGURE_NODE].normalize(editor, {
			code: NODE_DATA_INVALID,
			node: { key: 'mockKey' }
		})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
