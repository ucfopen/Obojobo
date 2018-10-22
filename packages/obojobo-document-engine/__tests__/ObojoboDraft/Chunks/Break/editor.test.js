import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Break from '../../../../ObojoboDraft/Chunks/Break/editor'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Break editor', () => {
	test('Node builds the expected component', () => {
		const Node = Break.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => ({})
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles size to large', () => {
		const Node = Break.components.Node
		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' })
					}
				}}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click') // toggle to large

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles size to large', () => {
		const Node = Break.components.Node
		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'large' })
					}
				}}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click') // toggle to normal

		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.moveToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		Break.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.moveToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => ({})
			}
		}
		const oboNode = Break.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large' }
		}
		const slateNode = Break.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a break when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: BREAK_NODE,
				data: {
					get: () => ({})
				}
			}
		}

		expect(Break.plugins.renderNode(props)).toMatchSnapshot()
	})
})
