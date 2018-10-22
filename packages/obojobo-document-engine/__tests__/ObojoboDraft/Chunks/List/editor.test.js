import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('../../../../src/scripts/oboeditor/util/text-util')

import List from '../../../../ObojoboDraft/Chunks/List/editor'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('List editor', () => {
	test('Node component', () => {
		const Node = List.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { listStyles: {} }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles type', () => {
		const Node = List.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return { listStyles: { type: 'ordered' } }
						}
					},
					filterDescendants: funct => {
						funct({ type: 'mockType' })
						return [
							{
								data: {
									get: () => {
										return {}
									}
								}
							}
						]
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

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles type from unordered to ordered', () => {
		const Node = List.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				node={{
					data: {
						get: () => {
							return { listStyles: { type: 'unordered' } }
						}
					},
					filterDescendants: funct => {
						funct({ type: 'mockType' })
						return [
							{
								data: {
									get: () => {
										return {}
									}
								}
							}
						]
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

		expect(tree).toMatchSnapshot()
	})

	test('Level component', () => {
		const Node = List.components.Level
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { bulletStyle: 'square', type: 'unordered' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Level component ordered', () => {
		const Node = List.components.Level
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { bulletStyle: 'alpha', type: 'ordered' }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Line component', () => {
		const Node = List.components.Line
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

	test('insertNode calls change methods', () => {
		const change = {}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)
		change.moveToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		List.helpers.insertNode(change)

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
					return { listStyles: {} }
				}
			},
			text: 'mockText',
			nodes: [
				{
					type: LIST_LEVEL_NODE,
					data: {
						get: () => {
							return {}
						}
					},
					nodes: [
						{
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
						},
						{
							type: LIST_LEVEL_NODE,
							data: {
								get: () => {
									return {}
								}
							},
							nodes: [
								{
									text: 'mockText',
									nodes: []
								}
							]
						}
					]
				}
			]
		}
		const oboNode = List.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('validateJSON fixes an incorrect Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			nodes: [
				{
					type: LIST_LEVEL_NODE,
					nodes: ['mockLine1']
				},
				{
					type: LIST_LINE_NODE,
					nodes: ['mockLine2']
				},
				{
					type: LIST_LINE_NODE
				}
			]
		}
		const slateNode = List.helpers.validateJSON(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				listStyles: {},
				textGroup: [
					{
						text: { value: 'mockLine1' }
					},
					{
						text: { value: 'mockLine1' },
						data: { indent: 5 }
					},
					{
						text: { value: 'mockLine2' }
					}
				]
			}
		}
		const slateNode = List.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node with a list style', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				listStyles: {
					type: 'unordered',
					indents: {}
				},
				textGroup: [
					{
						text: { value: 'mockLine1' }
					},
					{
						text: { value: 'mockLine1' },
						data: { indent: 5 }
					}
				]
			}
		}
		const slateNode = List.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(List.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: LIST_LEVEL_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(List.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: LIST_LINE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(List.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no list', () => {
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

		List.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] with normal delete', () => {
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
				},
				selection: {
					isCollapsed: true
				}
			}
		}

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on lists with more than one node', () => {
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
							nodes: { size: 3 }
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		change.removeNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on lists with one node', () => {
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
					key: 'mockLastKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		change.unwrapNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(change.unwrapNodeByKey).toHaveBeenCalledWith('mockLastKey')
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete] on lists with one top level node', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: jest
						.fn()
						.mockReturnValueOnce({}) // isType call
						.mockReturnValueOnce({
							key: 'mockLevel',
							nodes: { size: 1 }
						}) // listLevel
						.mockReturnValueOnce() // oneLevel
						.mockImplementationOnce((key, funct) => {
							funct({ key: 'mockKey' })
							return {
								key: 'mockParent',
								nodes: { size: 1 }
							}
						}) // parent
				},
				endBlock: {
					key: 'mockLastKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		change.removeNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(change.removeNodeByKey).toHaveBeenCalledWith('mockParent')
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
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
				},
				selection: {
					isCollapsed: false
				}
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(change.insertBlock).not.toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with double [Enter] on last node', () => {
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
							nodes: {
								size: 1,
								last: () => ({ key: 'mockKey' })
							}
						}
					}
				},
				endBlock: {
					key: 'mockKey',
					text: ''
				},
				selection: {
					isCollapsed: true
				}
			}
		}
		change.setNodeByKey = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
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
		change.unwrapBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(change.unwrapBlock).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return {
							data: {
								get: () => {
									return {
										bulletStyle: 'square',
										type: 'unordered'
									}
								}
							}
						}
					}
				}
			}
		}
		change.wrapBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(change.wrapBlock).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab] on ordered lists', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return {
							data: {
								get: () => {
									return {
										bulletStyle: 'square',
										type: 'ordered'
									}
								}
							}
						}
					}
				}
			}
		}
		change.wrapBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(change.wrapBlock).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keys', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: {
							get: () => {
								return { indent: 0 }
							}
						}
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

		List.plugins.onKeyDown(event, change)

		expect(change.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.normalizeNode exits if not applicable', () => {
		const change = {
			mergeNodeByKey: jest.fn()
		}
		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => funct(change))

		List.plugins.normalizeNode({
			object: 'text'
		})

		expect(change.mergeNodeByKey).not.toHaveBeenCalled()

		List.plugins.normalizeNode({
			object: 'block',
			type: 'mockNode'
		})

		expect(change.mergeNodeByKey).not.toHaveBeenCalled()

		List.plugins.normalizeNode({
			object: 'block',
			type: LIST_NODE,
			nodes: { size: 1 }
		})

		expect(change.mergeNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.normalizeNode exits if not invalid', () => {
		const node = {
			object: 'block',
			type: LIST_NODE,
			nodes: {
				map: funct => {
					funct({ type: LIST_LEVEL_NODE }, 0)
					funct({ type: LIST_LEVEL_NODE }, 1)
					funct({ type: 'notALevel' }, 0)

					return {
						filter: () => {
							return {
								size: 0
							}
						}
					}
				},
				get: i => {
					return i === 2 ? { type: 'notALevel' } : { type: LIST_LEVEL_NODE }
				}
			}
		}

		const change = {
			mergeNodeByKey: jest.fn()
		}
		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => funct(change))

		List.plugins.normalizeNode(node)

		expect(change.mergeNodeByKey).not.toHaveBeenCalled()
	})

	test('plugins.normalizeNode nomalizes levels next to each other', () => {
		const node = {
			object: 'block',
			type: LIST_NODE,
			nodes: {
				map: funct => {
					funct({ type: LIST_LEVEL_NODE }, 0)
					funct({ type: LIST_LEVEL_NODE }, 1)
					funct({ type: 'notALevel' }, 0)

					return {
						filter: () => {
							return {
								size: 10,
								forEach: funct => {
									funct({ key: 'mockKey1' })
								}
							}
						}
					}
				},
				get: i => {
					return i === 2 ? { type: 'notALevel' } : { type: LIST_LEVEL_NODE }
				}
			}
		}

		const change = {
			mergeNodeByKey: jest.fn()
		}
		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => funct(change))

		const call = List.plugins.normalizeNode(node)
		call(change)

		expect(change.mergeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in list', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'unordered'
							}
						}
					}
				},
				nodes: { size: 5 }
			},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in list', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'ordered'
							}
						}
					}
				},
				nodes: { size: 10 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing child in list', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'ordered'
							}
						}
					}
				},
				nodes: { size: 10 }
			},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in Level', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 10 } },
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid text children in Level', () => {
		const change = {
			moveToStartOfNextText: jest.fn()
		}
		change.wrapBlockByKey = jest.fn().mockReturnValueOnce(change)

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: { nodes: { size: 5 } },
			child: { object: 'text', key: 'mockKey' },
			index: 0
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes required children in Level', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {},
			child: { object: 'block' },
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
