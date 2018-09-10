import React from 'react'
import renderer from 'react-test-renderer'

import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

describe('Parameter Node', () => {
	test('Node builds the expected component', () => {
		const Node = ParameterNode.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: jest.fn().mockReturnValueOnce('item')
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: jest.fn().mockReturnValueOnce('mockType')
			},
			text: 'mockValue'
		}
		const oboNode = ParameterNode.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType'
		}
		const slateNode = ParameterNode.helpers.oboToSlate(oboNode)

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
