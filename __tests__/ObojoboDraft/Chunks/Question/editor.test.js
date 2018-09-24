import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../ObojoboDraft/Chunks/Break/editor')

import Question from '../../../../ObojoboDraft/Chunks/Question/editor'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Question editor', () => {
	test('Node builds the expected component', () => {
		const Node = Question.components.Node
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
		const Node = Question.components.Node

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: () => null
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.collapseToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		Question.helpers.insertNode(change)

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
					type: BREAK_NODE
				},
				{
					type: 'mockNode'
				}
			]
		}
		const oboNode = Question.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: BREAK_NODE
				},
				{
					type: 'mockNode'
				}
			]
		}
		const slateNode = Question.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
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

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: {
				key: 'mockKey',
				object: 'text'
			},
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children that are not text', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: {
				key: 'mockKey'
			},
			index: null
		})

		expect(change.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, CHILD_REQUIRED, {
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

		Question.plugins.schema.blocks[QUESTION_NODE].normalize(change, CHILD_REQUIRED, {
			node: {
				nodes: { size: 1 }
			},
			child: null,
			index: 1
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
