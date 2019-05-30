import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import SelectParameter from 'src/scripts/oboeditor/components/parameter-node/select-parameter'

const SELECT_PARAMETER = 'oboeditor.select-parameter'

describe('Select Parameter', () => {
	test('Node component', () => {
		const Node = SelectParameter.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: jest.fn()
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

	test('Node component edits value', () => {
		const Node = SelectParameter.components.Node

		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: jest
							.fn()
							.mockReturnValueOnce('mockType')
							.mockReturnValueOnce('Option 1')
							.mockReturnValueOnce(['Option 1', 'Option 2'])
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('select').simulate('click', { stopPropagation: jest.fn() })
		component.find('select').simulate('change', { target: { value: 'Option 2' } })

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: jest.fn()
						.mockReturnValueOnce('type-select')
						.mockReturnValueOnce('Option 1')
						.mockReturnValueOnce(['Option 1', 'Option 2'])
			},
			text: 'mockValue'
		}
		const oboNode = SelectParameter.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const slateNode = SelectParameter.helpers.oboToSlate(
			'oboName',
			'someValue',
			'someDisplay',
			['Option 1', 'Option 2']
		)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a Parameter when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: SELECT_PARAMETER,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(SelectParameter.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(SelectParameter.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
