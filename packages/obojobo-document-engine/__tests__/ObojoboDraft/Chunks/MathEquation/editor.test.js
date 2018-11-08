import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MathEquation from '../../../../ObojoboDraft/Chunks/MathEquation/editor'
const MATHEQUATION_NODE = 'ObojoboDraft.Chunks.MathEquation'

describe('MathEquation editor', () => {
	test('Node component', () => {
		const Node = MathEquation.components.Node
		//katex.renderToString.mockReturnValueOnce('<b></b>')
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { latex: '1' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component with error', () => {
		const Node = MathEquation.components.Node
		//katex.renderToString.mockReturnValueOnce('<b></b>')
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { latex: null }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component with label', () => {
		const Node = MathEquation.components.Node
		//katex.renderToString.mockReturnValueOnce('<b></b>')
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { latex: '1', label: '' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component changes input', () => {
		const Node = MathEquation.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
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

		component
			.find('input')
			.at(0)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: 'mockInput' }
			})

		expect(tree).toMatchSnapshot()
	})

	test('Node component changes label', () => {
		const Node = MathEquation.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
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

		component
			.find('input')
			.at(1)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: { value: 'mockInput' }
			})

		expect(tree).toMatchSnapshot()
	})

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		MathEquation.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
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
		const oboNode = MathEquation.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: { width: 'large' }
		}
		const slateNode = MathEquation.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a caption', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {}
		}
		const slateNode = MathEquation.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MATHEQUATION_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MathEquation.plugins.renderNode(props)).toMatchSnapshot()
	})
})
