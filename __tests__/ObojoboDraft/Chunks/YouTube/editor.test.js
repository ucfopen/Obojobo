import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import YouTube from '../../../../ObojoboDraft/Chunks/YouTube/editor'
const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

describe('YouTube editor', () => {
	test('Node builds the expected component', () => {
		const Node = YouTube.components.Node
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

	test('Node component changes input', () => {
		const Node = YouTube.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				children={'mockChildren'}
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		const click = component.find('input').simulate('click', {
			stopPropagation: () => true
		})

		const click2 = component.find('input').simulate('change', {
			target: { value: 'mockInput' }
		})

		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.collapseToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		YouTube.helpers.insertNode(change)

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
			text: 'mockText'
		}
		const oboNode = YouTube.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large' }
		}
		const slateNode = YouTube.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {}
		}
		const slateNode = YouTube.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			node: {
				type: YOUTUBE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(YouTube.plugins.renderNode(props)).toMatchSnapshot()
	})
})
