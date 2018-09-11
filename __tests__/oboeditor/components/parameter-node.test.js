import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

describe('Parameter Node', () => {
	test('Node component', () => {
		const Node = ParameterNode.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: jest.fn().mockReturnValueOnce(false)
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component with select', () => {
		const Node = ParameterNode.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: jest
							.fn()
							.mockReturnValueOnce(true)
							.mockReturnValueOnce('mockType')
							.mockReturnValueOnce('Option 1')
							.mockReturnValueOnce(['Option 1', 'Option 2'])
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component with select changes value', () => {
		const Node = ParameterNode.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: jest
							.fn()
							.mockReturnValueOnce(true)
							.mockReturnValueOnce('mockType')
							.mockReturnValueOnce('Option 1')
							.mockReturnValueOnce(['Option 1', 'Option 2'])
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: () => false
				}}
			/>
		)
		const tree = component.html()

		component.find('select').simulate('click', { stopPropagation: jest.fn() })
		component.find('select').simulate('change', { target: { value: 'Option 2' } })

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: jest.fn()
			},
			text: 'mockValue'
		}
		const oboNode = ParameterNode.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with select', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: jest.fn().mockReturnValueOnce(true)
			},
			text: 'mockValue'
		}
		const oboNode = ParameterNode.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const slateNode = ParameterNode.helpers.oboToSlate('mockKey', 'mockValue', 'Mock Display')

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with options', () => {
		const slateNode = ParameterNode.helpers.oboToSlate('mockKey', 'mockValue', 'Mock Display', [
			'Mock Option 1',
			'Mock Option 2',
			'Mock Option 3'
		])

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a Parameter when passed', () => {
		const props = {
			node: {
				type: 'Parameter',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(ParameterNode.plugins.renderNode(props)).toMatchSnapshot()
	})
})
