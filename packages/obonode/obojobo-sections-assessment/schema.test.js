import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Schema from './schema'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'

describe('Assessment Schema', () => {
	test('normalize fixes invalid first child in Assessment', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid second child in Assessment', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid third child in Assessment', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 2
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid fourth child in Assessment', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 3
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('normalize adds missing first child in Assessment', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing second child in Assessment', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing third child in Assessment', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 2
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing fourth child in Assessment', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[ASSESSMENT_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 3
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid second child in Settings', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		editor.withoutNormalizing = funct => {
			funct(editor)
		}

		Schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize fixes invalid first child in mod', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}
		editor.withoutNormalizing = funct => {
			funct(editor)
		}

		Schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing first child in mod', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing second child in Settings', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
