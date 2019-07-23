import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ToggleParameter from 'src/scripts/oboeditor/components/parameter-node/toggle-parameter'

const TOGGLE_PARAMETER = 'oboeditor.toggle-parameter'

describe('Toggle Parameter', () => {
	test('Node component with checkbox', () => {
		const Node = ToggleParameter.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: jest
							.fn()
							.mockReturnValueOnce('mockType')
							.mockReturnValueOnce(false)
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component with select changes value', () => {
		const Node = ToggleParameter.components.Node

		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					data: {
						get: jest
							.fn()
							.mockReturnValueOnce('mockType')
							.mockReturnValueOnce(false)
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('input').simulate('change', { target: { checked: true } })

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: jest.fn()
						.mockReturnValueOnce('mockType')
						.mockReturnValueOnce(false)
			},
			text: 'mockValue'
		}
		const oboNode = ToggleParameter.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const slateNode = ToggleParameter.helpers.oboToSlate(
			'oboName',
			false,
			'someDisplay'
		)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a Parameter when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: TOGGLE_PARAMETER,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(ToggleParameter.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(ToggleParameter.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
