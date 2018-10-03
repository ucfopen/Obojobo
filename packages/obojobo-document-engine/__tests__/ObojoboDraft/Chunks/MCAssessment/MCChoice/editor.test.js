import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/editor')
jest.mock('../../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/editor')

import MCChoice from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/editor'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'

describe('MCChoice editor', () => {
	test('Node component', () => {
		const Node = MCChoice.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: []
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component correct choice', () => {
		const Node = MCChoice.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => {
							return { score: 100 }
						}
					},
					nodes: { size: 2 }
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component deletes itself', () => {
		const Node = MCChoice.components.Node

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					key: 'mockKey',
					nodes: [],
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

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component changes score', () => {
		const Node = MCChoice.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								score: 0
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

		expect(change.setNodeByKey).toHaveBeenCalledWith('mockKey', {
			data: { content: { score: 100 } }
		})

		const component2 = mount(
			<Node
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								score: 100
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

		component2
			.find('button')
			.at(1)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalledWith('mockKey', {
			data: { content: { score: 0 } }
		})
	})

	test('Node component adds feedback', () => {
		const Node = MCChoice.components.Node

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					key: 'mockKey',
					nodes: [],
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

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: MCANSWER_NODE
				},
				{
					type: MCFEEDBACK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			]
		}
		const oboNode = MCChoice.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: MCANSWER_NODE
				},
				{
					type: MCFEEDBACK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			]
		}
		const slateNode = MCChoice.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a choice', () => {
		const props = {
			node: {
				type: MCCHOICE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCChoice.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { key: 'mockKey', type: MCFEEDBACK_NODE },
			index: 1
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes too many children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { key: 'mockKey' },
			index: 3
		})

		expect(change.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes extra children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { key: 'mockKey', type: 'wrongType' },
			index: 1
		})

		expect(change.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCChoice.plugins.schema.blocks[MCCHOICE_NODE].normalize(change, CHILD_REQUIRED, {
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
