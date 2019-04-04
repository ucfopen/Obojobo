import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID } = SchemaViolations

import Schema from './schema'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('List Schema', () => {
	test('List data checks for content', () => {
		expect(Schema.blocks[LIST_NODE].data.content('mockContent')).toEqual(true)
	})

	test('normalize fixes invalid data in list', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		Schema.blocks[LIST_NODE].normalize(editor, {
			code: NODE_DATA_INVALID,
			node: { key: 'mockKey', data: { get: () => ({ listStyles: { type: 'unordered' } }) } }
		})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Level data checks for content', () => {
		expect(Schema.blocks[LIST_LEVEL_NODE].data.content('mockContent')).toEqual(true)
	})

	test('normalize fixes invalid data in level', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		Schema.blocks[LIST_LEVEL_NODE].normalize(editor, {
			code: NODE_DATA_INVALID,
			node: { key: 'mockKey' }
		})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
