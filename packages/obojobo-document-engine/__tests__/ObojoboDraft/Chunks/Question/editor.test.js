import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Question from '../../../../ObojoboDraft/Chunks/Question/editor'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

describe('Question editor', () => {
	test('plugins.renderNode renders a question when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: QUESTION_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Question.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a solution when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: SOLUTION_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Question.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		change.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(change)
		})

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: {
				key: 'mockKey',
				object: 'text'
			},
			index: null
		})

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {
				nodes: { size: 0 }
			},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children at last node', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {
				nodes: { size: 1 }
			},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in solution', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[SOLUTION_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {
				nodes: { size: 0 }
			},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in solution', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Question.plugins.schema.blocks[SOLUTION_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: {
				key: 'mockKey',
				object: 'text'
			},
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})
})
