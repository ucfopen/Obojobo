import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID } = SchemaViolations

import Schema from './schema'
const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('ActionButton Schema', () => {
	test('data checks for content', () => {
		expect(Schema.blocks[BUTTON_NODE].data.content('mockContent')).toEqual(true)
	})
	test('normalize fixes invalid data', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		Schema.blocks[BUTTON_NODE].normalize(editor, {
			code: NODE_DATA_INVALID,
			node: { key: 'mockKey' }
		})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
