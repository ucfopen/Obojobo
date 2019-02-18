import { CHILD_TYPE_INVALID } from 'slate-schema-violations'

import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/editor'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'

describe('QuestionBank editor', () => {
	test('plugins.renderNode renders a question bank when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: QUESTION_BANK_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(QuestionBank.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(QuestionBank.plugins.renderNode(props, null, next)).toMatchSnapshot()
	})

	test('plugins.renderNode renders settings when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: SETTINGS_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(QuestionBank.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes first invalid child in bank', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes second invalid child in bank', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in bank', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in bank', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in setting', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in setting', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes first invalid child in setting', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = funct => funct(editor)

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes second invalid child in setting', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = funct => funct(editor)

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
