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
	test('Node renders correctly', () => {
		const Node = Figure.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {
								size: 'mockSize',
								url: 'mockUrl',
								alt: 'mockAlt'
							}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node renders with custom size correctly', () => {
		expect.assertions(3)

		const Node = Figure.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {
								size: 'custom',
								url: 'mockUrl',
								alt: 'mockAlt',
								width: 'customWidth',
								height: 'customHeight'
							}
						}
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		const componentNoWidth = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {
								size: 'custom',
								url: 'mockUrl',
								alt: 'mockAlt',
								height: 'customHeight'
							}
						}
					}
				}}
			/>
		)
		expect(componentNoWidth.toJSON()).toMatchSnapshot()

		const componentNoHeight = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {
								size: 'custom',
								url: 'mockUrl',
								alt: 'mockAlt',
								width: 'mockWidth'
							}
						}
					}
				}}
			/>
		)
		expect(componentNoHeight.toJSON()).toMatchSnapshot()
	})

	test('Node component edits alt text', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce('mockAltText')

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
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

		expect(change.setNodeByKey).toBeCalledWith(
			'mock_key',
			expect.objectContaining({ data: { content: { alt: 'mockAltText' } } })
		)
	})

	test('Node component edits alt text - defaulting to content.alt if input invalid', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
					data: {
						get: () => {
							return {
								alt: 'contentAlt'
							}
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

		expect(change.setNodeByKey).toBeCalledWith(
			'mock_key',
			expect.objectContaining({ data: { content: { alt: 'contentAlt' } } })
		)
	})

	test('Node component edits url', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce('mockUrl')

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
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
			.at(1)
			.simulate('click')

		expect(change.setNodeByKey).toBeCalledWith(
			'mock_key',
			expect.objectContaining({ data: { content: { url: 'mockUrl' } } })
		)
	})

	test('Node component edits url - defaulting to content.url if input invalid', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(null)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
					data: {
						get: () => {
							return {
								url: 'contentUrl'
							}
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
			.at(1)
			.simulate('click')

		expect(change.setNodeByKey).toBeCalledWith(
			'mock_key',
			expect.objectContaining({ data: { content: { url: 'contentUrl' } } })
		)
	})

	test('Node component deletes self', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
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
			.at(2)
			.simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
	})

	test('Node component changes size', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
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

		// to fulfill coverage
		component.find('select').simulate('click', {
			stopPropagation: () => true
		})

		component.find('select').simulate('change', {
			target: { value: 'small' }
		})

		expect(change.setNodeByKey).toBeCalledWith(
			'mock_key',
			expect.objectContaining({
				data: {
					content: expect.objectContaining({ size: 'small' })
				}
			})
		)
	})

	test('Node component accepts custom size', () => {
		jest.spyOn(window, 'prompt')
		window.prompt.mockReturnValueOnce(100).mockReturnValueOnce(200)

		const change = {
			setNodeByKey: jest.fn()
		}

		const Node = Figure.components.Node
		const component = mount(
			<Node
				node={{
					key: 'mock_key',
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

		component.find('select').simulate('change', {
			target: { value: 'custom' }
		})

		expect(change.setNodeByKey).toBeCalledWith(
			'mock_key',
			expect.objectContaining({
				data: {
					content: expect.objectContaining({ size: 'custom', height: 100, width: 200 })
				}
			})
		)
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
