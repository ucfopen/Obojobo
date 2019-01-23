import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Common from 'Common'
import Question from '../../../../ObojoboDraft/Chunks/Question/editor'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'

jest.mock('Common', () => ({
	Registry: {
		registerModel: jest.fn()
	},
	components: { Button: jest.fn() }
}))

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

		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => {
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

	test('getNavItem returns expected object', () => {
		const questionMock = Common.Registry.registerModel.mock.calls[0][1]

		const model = {
			parent: {
				children: {
					models: [{ get: () => true }]
				}
			},
			modelState: {
				mode: 'practice'
			},
			title: 'TestTitle',
			get: () => 'testId'
		}

		expect(questionMock.getNavItem(model)).toEqual({
			label: 'TestTitle',
			path: ['#obo-testId'],
			type: 'sub-link'
		})

		model.title = null
		expect(questionMock.getNavItem(model)).toEqual({
			label: 'Practice Question 0',
			path: ['#obo-testId'],
			type: 'sub-link'
		})

		model.modelState.mode = null
		expect(questionMock.getNavItem(model)).toEqual({
			label: 'Question 0',
			path: ['#obo-testId'],
			type: 'sub-link'
		})
	})
})
