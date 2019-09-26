import Schema from './schema'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

describe('Page editor schema', () => {
	test('plugins.schema.normalize adds required children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize handles invalid children types', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
