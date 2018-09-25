import React from 'react'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../src/scripts/oboeditor/util/text-util')

import Text from '../../../../ObojoboDraft/Chunks/Text/editor'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Text editor', () => {
	test('Node builds the expected component', () => {
		const Node = Text.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => 0
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Line builds the expected component', () => {
		const Node = Text.components.Line
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				node={{
					data: {
						get: () => 0
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

		Text.helpers.insertNode(change)

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
					return null
				}
			},
			nodes: [
				{
					text: 'mockCode',
					data: {
						get: () => {
							return {}
						}
					},
					nodes: [
						{
							leaves: [
								{
									text: 'mockCode',
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
						data: { indent: 1 },
						text: { value: 'mockCode' }
					},
					{
						text: { value: 'mockCode2' }
					}
				]
			}
		}
		const slateNode = Text.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders code when passed', () => {
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

	test('plugins.renderNode renders a line when passed', () => {
		const props = {
			node: {
				type: TEXT_LINE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Text.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no text', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				},
				endBlock: {
					key: 'mockKey',
					text: 'mockText'
				}
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (num, funct) => {
						funct({ key: 'mockKey' })
						return {
							key: 'mockParent',
							nodes: { size: 1 }
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: 'mockText'
				}
			}
		}
		change.removeNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.removeNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] deletes empty code node', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (num, funct) => {
						funct({ key: 'mockKey' })
						return {
							key: 'mockParent',
							nodes: { size: 1 }
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				}
			}
		}
		change.removeNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with first [Enter]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => true
				},
				endBlock: {
					key: 'mockKey',
					text: 'mockText'
				}
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with second [Enter]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => true
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				}
			}
		}
		change.removeNodeByKey = jest.fn().mockReturnValueOnce(change)
		change.splitBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
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

	test('plugins.onKeyDown deals with [Shift]+[Tab] with indented code', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 6 }
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

	test('plugins.onKeyDown deals with [Alt]+[Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			altKey: true,
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalledWith('mockBlockKey', {
			data: { indent: 1 }
		})
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		change.insertText = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.insertText).toHaveBeenCalledWith('\t')
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keys', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				}
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in text', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: null,
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in text', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 9
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in text', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_NODE].normalize(change, CHILD_REQUIRED, {
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in text line', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_LINE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: null,
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.unwrapNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in text line', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Text.plugins.schema.blocks[TEXT_LINE_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 9
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})
})
