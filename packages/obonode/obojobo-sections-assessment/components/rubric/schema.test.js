import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

import Schema from './schema'

const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

describe('Rubric Schema', () => {
	test('normalize adds missing first child in rubric', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[RUBRIC_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing second child in rubric', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[RUBRIC_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing third child in rubric', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[RUBRIC_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			index: 2
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing third child in rubric', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[RUBRIC_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			index: 3
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing children in ModList', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[MOD_LIST_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing first child in mod', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[MOD_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('normalize adds missing second child in mod', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[MOD_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
