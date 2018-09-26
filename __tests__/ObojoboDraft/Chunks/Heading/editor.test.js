import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('../../../../src/scripts/oboeditor/util/text-util')

import Heading from '../../../../ObojoboDraft/Chunks/Heading/editor'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

describe('Heading editor', () => {
	test('Node component', () => {
		const Node = Heading.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					text: ''
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component mounts and unmounts properly', () => {
		jest.spyOn(document, 'addEventListener')
		const Node = Heading.components.Node
		const component = mount(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					text: 'Your Title Goes Here'
				}}
			/>
		)
		const tree = component.html()

		component.unmount()

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles level select', () => {
		const Node = Heading.components.Node
		const component = mount(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					text: 'Your Title Here'
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Node component handles clicks', () => {
		const Node = Heading.components.Node
		const component = mount(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					text: 'Your Title Here'
				}}
			/>
		)

		const nodeInstance = component.instance()
		nodeInstance.node = {
			contains: value => value
		}

		nodeInstance.handleClick({ target: true }) // click inside

		let tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.handleClick({ target: false }) // click outside

		tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.node = null
		nodeInstance.handleClick() // click without node

		tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Node component changes heading level', () => {
		const Node = Heading.components.Node
		const component = mount(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					text: 'Your Title Here'
				}}
				editor={{
					value: {
						change: () => ({
							setNodeByKey: jest.fn()
						})
					},
					onChange: () => false
				}}
			/>
		)

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 1
		component
			.find('button')
			.at(1)
			.simulate('click')

		let tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 2
		component
			.find('button')
			.at(2)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 3
		component
			.find('button')
			.at(3)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 4
		component
			.find('button')
			.at(4)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 5
		component
			.find('button')
			.at(5)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()

		// open select
		component
			.find('button')
			.at(0)
			.simulate('click')

		// toggle level 6
		component
			.find('button')
			.at(6)
			.simulate('click')

		tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.collapseToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		Heading.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.collapseToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return {}
				}
			},
			text: 'mockText',
			nodes: [
				{
					leaves: [
						{
							text: 'mockText',
							marks: [
								{
									type: 'b',
									data: {}
								}
							]
						}
					]
				}
			]
		}
		const oboNode = Heading.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				textGroup: [
					{
						text: { value: 'mockText' },
						data: { align: 'right' }
					},
					{
						text: { value: 'mockText' }
					}
				]
			}
		}
		const slateNode = Heading.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			node: {
				type: HEADING_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Heading.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'text'
				}
			})
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: 'mockType'
				}
			})
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: HEADING_NODE,
					text: 'Some text'
				}
			})
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Heading.plugins.renderPlaceholder({
				node: {
					object: 'block',
					type: HEADING_NODE,
					text: '',
					data: { get: () => ({ align: 'left' }) }
				}
			})
		).toMatchSnapshot()
	})
})
