import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import EditorSchema from 'src/scripts/oboeditor/plugins/editor-schema'

describe('EditorSchema', () => {
	test('matcher builds oboeditor.component', () => {
		expect(EditorSchema.schema).toMatchSnapshot()
	})
	test('normalize fixes required children in editor', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		EditorSchema.schema.document.normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid block children in editor', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(editor)
		})

		EditorSchema.schema.document.normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { object: 'block', key: 'mockChild' },
			index: 0
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid children in editor', () => {
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
