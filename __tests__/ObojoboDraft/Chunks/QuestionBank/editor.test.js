import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../ObojoboDraft/Chunks/Question/editor')

import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/editor'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'

describe('QuestionBank editor', () => {
	test('Node builds the expected component', () => {
		const Node = QuestionBank.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				children={'mockChildren'}
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
				children={'mockChildren'}
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

		const click = component
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

		const component = shallow(
			<Node
				children={'mockChildren'}
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

		const click = component
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

		const component = shallow(
			<Node
				children={'mockChildren'}
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

		const click = component
			.find('button')
			.at(2)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component changes select number', () => {
		const Node = QuestionBank.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				children={'mockChildren'}
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

		const click = component.find('input').simulate('change', {
			target: { value: 'mockValue' }
		})

		const click1 = component.find('input').simulate('click', {
			stopPropagation: jest.fn()
		})

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component changes choose type', () => {
		const Node = QuestionBank.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				children={'mockChildren'}
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

		const click = component.find('select').simulate('change', {
			target: { value: 'mockValue' }
		})

		const click1 = component.find('select').simulate('click', {
			stopPropagation: jest.fn()
		})

		expect(change.setNodeByKey).toHaveBeenCalled()
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
					type: 'mockQuestionNode'
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

	test('plugins.renderNode renders a button when passed', () => {
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

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		QuestionBank.plugins.schema.blocks[QUESTION_BANK_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
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
})
