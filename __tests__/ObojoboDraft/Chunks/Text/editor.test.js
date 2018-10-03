import React from 'react'
import renderer from 'react-test-renderer'

import Text from '../../../../ObojoboDraft/Chunks/Text/editor'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

describe('Text editor', () => {
	test('Node builds the expected component', () => {
		const Node = Text.components.Node
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
		change.moveToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		Text.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.moveToStartOfNextText).toHaveBeenCalled()
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
		const oboNode = Text.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
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
		const slateNode = Text.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with an indent', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				textGroup: [
					{
						data: { indent: 1 },
						text: { value: 'mockText' }
					}
				]
			}
		}
		const slateNode = Text.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			node: {
				type: TEXT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Text.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
						type: TEXT_NODE,
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab] with indented text', () => {
		const change = {
			value: {
				blocks: [
					{
						type: TEXT_NODE,
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 6 }
							}
						}
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
						type: TEXT_NODE,
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
					}
				]
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with unregistered key', () => {
		const change = {
			value: {
				blocks: [
					{
						type: TEXT_NODE,
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
					}
				]
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'k',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})
})
