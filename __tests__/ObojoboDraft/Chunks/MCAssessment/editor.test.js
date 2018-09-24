import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/editor')

import MCAssessment from '../../../../ObojoboDraft/Chunks/MCAssessment/editor'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

describe('MCAssessment editor', () => {
	test('Node builds the expected component', () => {
		const Node = MCAssessment.components.Node
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

	test('Node component adds choice', () => {
		const Node = MCAssessment.components.Node

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
		const tree = component.html()

		component.find('button').simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component changes shuffle', () => {
		const Node = MCAssessment.components.Node

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

		component.find('input').simulate('change', {
			target: { checked: true }
		})

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component changes shuffle', () => {
		const Node = MCAssessment.components.Node

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

		component.find('select').simulate('change', {
			target: { value: 'mockValue' },
			stopPropagation: jest.fn()
		})

		component.find('select').simulate('click', {
			target: { value: 'mockValue' },
			stopPropagation: jest.fn()
		})

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with no content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => null
			},
			nodes: [
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const oboNode = MCAssessment.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return { responseType: 'pick-one-multiple-correct' }
				}
			},
			nodes: [
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 100 }
						}
					}
				},
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const oboNode = MCAssessment.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with two correct', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return { responseType: 'pick-one' }
				}
			},
			nodes: [
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 100 }
						}
					}
				},
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 100 }
						}
					}
				},
				{
					type: MCCHOICE_NODE,
					data: {
						get: () => {
							return { score: 0 }
						}
					}
				}
			]
		}
		const oboNode = MCAssessment.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: MCCHOICE_NODE
				},
				{
					type: 'NotADefinedNode'
				}
			]
		}
		const slateNode = MCAssessment.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			node: {
				type: MCASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCAssessment.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[MCASSESSMENT_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCAssessment.plugins.schema.blocks[MCASSESSMENT_NODE].normalize(change, CHILD_REQUIRED, {
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
