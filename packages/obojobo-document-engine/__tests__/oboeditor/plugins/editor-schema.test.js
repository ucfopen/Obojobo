import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import EditorSchema from 'src/scripts/oboeditor/plugins/editor-schema'

describe('EditorSchema', () => {
	test('matcher builds a list of all possible node types', () => {
		expect(EditorSchema.schema).toMatchSnapshot()
	})
	test('schema.normalize fixes required children in editor', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		EditorSchema.schema.document.normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('schema.normalize fixes invalid children in editor', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		EditorSchema.schema.document.normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { object: 'text', key: 'mockChild' },
			index: 0
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})
})
