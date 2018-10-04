import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../../ObojoboDraft/Chunks/Break/editor')

import MCFeedback from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/editor'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('MCFeedback editor', () => {
	test('Node builds the expected component', () => {
		const Node = MCFeedback.components.Node
		const component = renderer.create(
			<Node
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

	test('Node component deletes itself', () => {
		const Node = MCFeedback.components.Node

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
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

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
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
					type: BREAK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			]
		}
		const oboNode = MCFeedback.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			children: [
				{
					type: BREAK_NODE
				},
				{
					type: 'notADefinedNode'
				}
			]
		}
		const slateNode = MCFeedback.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a node', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MCFEEDBACK_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(MCFeedback.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCFeedback.plugins.schema.blocks[MCFEEDBACK_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', object: 'text' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes non-text invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		MCFeedback.plugins.schema.blocks[MCFEEDBACK_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		MCFeedback.plugins.schema.blocks[MCFEEDBACK_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
