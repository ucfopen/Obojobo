import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import EditorSchema from 'src/scripts/oboeditor/plugins/editor-schema'

describe('EditorSchema', () => {
	test('matcher builds oboeditor.component', () => {
		expect(EditorSchema.schema).toMatchSnapshot()
	})
	test('schema.normalize fixes required children in editor', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		EditorSchema.schema.document.normalize(editor, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('schema.normalize fixes invalid children in editor', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(editor)
		})

		EditorSchema.schema.document.normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { object: 'text', key: 'mockChild' },
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
