import React from 'react'
import { CHILD_TYPE_INVALID } from 'slate-schema-violations'
import { Block } from 'slate'

import Question from './editor-registration'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const CHOICE_LIST_NODE = 'ObojoboDraft.Chunks.MCAssessment.ChoiceList'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		getItemForType: jest.fn()
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		},
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	}
}))

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

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

		expect(Question.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Question.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Question.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		editor.withoutNormalizing = jest.fn().mockImplementationOnce(funct => {
			funct(editor)
		})

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: {
				key: 'mockKey',
				object: 'text'
			},
			index: null
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {
				nodes: { size: 0 }
			},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children at last node', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {
				nodes: { size: 1 }
			},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in solution', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[SOLUTION_NODE].normalize(editor, {
			code: 'child_min_invalid',
			node: {
				nodes: { size: 0 }
			},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in solution', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Question.plugins.schema.blocks[SOLUTION_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: {
				key: 'mockKey',
				object: 'text'
			},
			index: null
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('getNavItem returns expected object', () => {
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

		expect(Question.getNavItem(model)).toEqual({
			label: 'TestTitle',
			path: ['#obo-testId'],
			type: 'sub-link'
		})

		model.title = null
		expect(Question.getNavItem(model)).toEqual({
			label: 'Question 0',
			path: ['#obo-testId'],
			type: 'sub-link'
		})

		model.modelState.mode = null
		expect(Question.getNavItem(model)).toEqual({
			label: 'Question 0',
			path: ['#obo-testId'],
			type: 'sub-link'
		})
	})

	test('getPasteNode returns whole question', () => {
		const question = {
			type: QUESTION_NODE,
			object: 'block',
			nodes: [
				{
					type: MCASSESSMENT_NODE,
					object: 'block'
				},
				{
					type: 'mock-node',
					object: 'block'
				}
			]
		}

		const qBlock = Block.create(question)

		expect(Question.getPasteNode(qBlock)).toEqual(qBlock)
	})

	test('getPasteNode returns just content nodes', () => {
		const question = {
			type: QUESTION_NODE,
			object: 'block',
			nodes: [
				{
					type: 'mock-node',
					object: 'block'
				}
			]
		}

		const qBlock = Block.create(question)

		expect(Question.getPasteNode(Block.create(qBlock))).toMatchInlineSnapshot(`
		Array [
		  Immutable.Record {
		    "data": Immutable.Map {},
		    "key": "18",
		    "nodes": Immutable.List [],
		    "type": "mock-node",
		  },
		]
	`)
	})

	test('getPasteNode returns just assessment internal nodes', () => {
		const question = {
			type: QUESTION_NODE,
			object: 'block',
			nodes: [
				{
					type: MCASSESSMENT_NODE,
					object: 'block',
					nodes: [
						{
							type: CHOICE_LIST_NODE,
							object: 'block',
							nodes: [
								{
									type: 'mockMCChoice',
									object: 'block',
									nodes: [
										{
											type: 'mockAns',
											object: 'block',
											nodes: [{ type: 'mockContent', object: 'block' }]
										}
									]
								}
							]
						},
						{
							type: 'mockSettingsNode',
							object: 'block'
						}
					]
				}
			]
		}

		const qBlock = Block.create(question)

		expect(Question.getPasteNode(Block.create(qBlock))).toMatchInlineSnapshot(`
		Array [
		  Immutable.Record {
		    "data": Immutable.Map {},
		    "key": "24",
		    "nodes": Immutable.List [],
		    "type": "mockContent",
		  },
		]
	`)
	})

	test('getPasteNode returns just solution internal nodes', () => {
		const childNode = { type: 'mockChildNode', object: 'block' }
		const question = {
			type: QUESTION_NODE,
			object: 'block',
			nodes: [
				{
					type: SOLUTION_NODE,
					object: 'block',
					nodes: [
						{
							type: 'mockPageNode',
							object: 'block',
							nodes: [childNode]
						}
					]
				}
			]
		}

		const qBlock = Block.create(question)

		expect(Question.getPasteNode(Block.create(qBlock))).toMatchInlineSnapshot(`
		Array [
		  Immutable.Record {
		    "data": Immutable.Map {},
		    "key": "29",
		    "nodes": Immutable.List [],
		    "type": "mockChildNode",
		  },
		]
	`)
	})
})
