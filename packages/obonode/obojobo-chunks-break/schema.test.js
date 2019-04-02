import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID } = SchemaViolations

import Schema from './schema'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Break Schema', () => {
	test('data checks for content', () => {
		expect(Schema.blocks[BREAK_NODE].data.content('mockContent')).toEqual(true)
	})
	test('normalize fixes invalid data', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		Schema.blocks[BREAK_NODE].normalize(editor, {
			code: NODE_DATA_INVALID,
			node: { key: 'mockKey' }
		})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
