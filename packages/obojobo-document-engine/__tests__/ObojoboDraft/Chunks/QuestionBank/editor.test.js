import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

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

		expect(QuestionBank.plugins.renderNode(props)).toMatchSnapshot()
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
		const change = {
			wrapBlockByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes second invalid child in bank', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in bank', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in bank', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing first child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing second child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes first invalid child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		change.withoutNormalization = funct => funct(change)

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes second invalid child in setting', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		change.withoutNormalization = funct => funct(change)

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
