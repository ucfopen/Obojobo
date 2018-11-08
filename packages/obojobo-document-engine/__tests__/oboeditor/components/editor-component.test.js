import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID, CHILD_UNKNOWN } from 'slate-schema-violations'

import Component from 'src/scripts/oboeditor/components/editor-component'
const COMPONENT_NODE = 'oboeditor.component'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Component editor', () => {
	test('Node builds the expected component', () => {
		const Node = Component.components.Node
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

	test('Node component inserts node above', () => {
		const Node = Component.components.Node
		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' })
					}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('Node component inserts node below', () => {
		const Node = Component.components.Node

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' })
					},
					nodes: { size: 0}
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(23)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			nodes: [
				{
					type: BREAK_NODE,
					data: { get: () => ({ width: 'large'}) }
				}
			]
		}
		const oboNode = Component.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType'
		}
		const slateNode = Component.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a component when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: COMPONENT_NODE,
				data: {
					get: () => ({})
				}
			}
		}

		expect(Component.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children in component', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in component', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes extra children in component', () => {
		const change = {
			splitNodeByKey: jest.fn()
		}

		Component.plugins.schema.blocks[COMPONENT_NODE].normalize(change, {
			code: CHILD_UNKNOWN,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.splitNodeByKey).toHaveBeenCalled()
	})
})
