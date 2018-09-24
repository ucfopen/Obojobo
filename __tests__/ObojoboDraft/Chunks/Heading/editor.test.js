import React from 'react'
import renderer from 'react-test-renderer'

import Heading from '../../../../ObojoboDraft/Chunks/Heading/editor'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

describe('Heading editor', () => {
	test('Node builds the expected component', () => {
		const Node = Heading.components.Node
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
})
