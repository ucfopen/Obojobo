import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../ObojoboDraft/Chunks/Question/editor')
jest.mock('../../../../src/scripts/oboeditor/components/parameter-node', () => ({
	helpers: {
		oboToSlate: () => ({
			type: 'mockNode'
		})
	}
}))

import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/editor'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('QuestionBank editor', () => {
	test('Node builds the expected component', () => {
		const Node = QuestionBank.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node builds the expected component', () => {
		const Node = QuestionBank.components.Settings
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component deletes self', () => {
		const Node = QuestionBank.components.Node

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return { choose: 8, select: 'sequential' }
						}
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component adds question', () => {
		const Node = QuestionBank.components.Node

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					data: {
						get: () => ({ content: {} })
					},
					nodes: []
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component adds question bank', () => {
		const Node = QuestionBank.components.Node

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return { choose: 8, select: 'sequential' }
						}
					},
					nodes: []
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.collapseToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		QuestionBank.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.collapseToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: QUESTION_BANK_NODE,
					key: 'mockKey',
					data: {
						get: () => null
					},
					nodes: []
				},
				{
					type: QUESTION_NODE
				},
				{
					type: SETTINGS_NODE,
					nodes: {
						first: () => ({ text: 'mockText' }),
						last: () => ({
							data: {
								get: () => false
							}
						})
					}
				}
			]
		}
		const oboNode = QuestionBank.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { choose: Infinity },
			children: [
				{
					type: QUESTION_BANK_NODE,
					id: 'mockKey',
					content: { choose: 1 },
					children: [
						{
							type: 'mockQuestionNode'
						}
					]
				},
				{
					type: 'mockQuestionNode'
				}
			]
		}
		const slateNode = QuestionBank.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a question bank when passed', () => {
		const props = {
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

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, CHILD_REQUIRED, {
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

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, CHILD_REQUIRED, {
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

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, CHILD_REQUIRED, {
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

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, CHILD_REQUIRED, {
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

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

		QuestionBank.plugins.schema.blocks[SETTINGS_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
