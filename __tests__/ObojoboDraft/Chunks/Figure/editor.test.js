import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Figure from '../../../../ObojoboDraft/Chunks/Figure/editor'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

describe('Figure editor', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
	})
	test('Node builds the expected component', () => {
		const Node = Figure.components.Node
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

	test('Node component edits alt text', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
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

	test('Node component edits url', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
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

		expect(tree).toMatchSnapshot()
	})

	test('Node component deletes self', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			removeNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
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

		expect(tree).toMatchSnapshot()
	})

	test('Node component changes size', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(100).mockReturnValueOnce(100)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		const click = component.find('select').simulate('change', {
			target: { value: 'custom' }
		})

		expect(tree).toMatchSnapshot()
	})

	test('Node component changes size with no width or height', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null).mockReturnValueOnce(null)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		const click = component.find('select').simulate('change', {
			target: { value: 'custom' }
		})

		expect(tree).toMatchSnapshot()
	})

	test('Node component changes size to small', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
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
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		const click = component.find('select').simulate('click', {
			stopPropagation: () => true
		})

		const click2 = component.find('select').simulate('change', {
			target: { value: 'small' }
		})

		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.collapseToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		Figure.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.collapseToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: type => {
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
		const oboNode = Figure.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large' }
		}
		const slateNode = Figure.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				textGroup: [
					{
						text: { value: 'mockCaption' }
					}
				]
			}
		}
		const slateNode = Figure.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			node: {
				type: FIGURE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Figure.plugins.renderNode(props)).toMatchSnapshot()
	})
})
