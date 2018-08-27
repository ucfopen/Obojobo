import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID, PARENT_TYPE_INVALID } from 'slate-schema-violations'

import List from '../../../../ObojoboDraft/Chunks/List/editor'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

describe('List editor', () => {
	test('Node component', () => {
		const Node = List.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				children={'mockChildren'}
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
				children={'mockChildren'}
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

		const click = component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles type from unordered to ordered', () => {
		const Node = List.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				children={'mockChildren'}
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

		const click = component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('Level component', () => {
		const Node = List.components.Level
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
				children={'mockChildren'}
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
				attributes={{ dummy: 'dummyData' }}
				children={'mockChildren'}
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
				attributes={{ dummy: 'dummyData' }}
				children={'mockChildren'}
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

		List.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.collapseToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: type => {
					return { listStyles: {} }
				}
			},
			text: 'mockText',
			nodes: [
				{
					type: LIST_LEVEL_NODE,
					data: {
						get: type => {
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
								get: type => {
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

	test('plugins.onKeyDown deals with [Enter]', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => true
				}
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown(event, change)

		expect(change.insertBlock).toHaveBeenCalled()
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

	test('plugins.validateNode nomalizes levels next to each other', () => {
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
								reverse: () => [
									{
										key: 'mockKey1'
									},
									{
										key: 'mockKey2'
									}
								]
							}
						}
					}
				},
				get: i => {
					console.log(i)
					return i === 2 ? { type: 'notALevel' } : { type: LIST_LEVEL_NODE }
				}
			}
		}

		const change = {
			mergeNodeByKey: jest.fn()
		}
		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => funct(change))

		const call = List.plugins.validateNode(node)
		call(change)

		expect(change.mergeNodesByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'unordered'
							}
						}
					}
				}
			},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_NODE].normalize(change, CHILD_REQUIRED, {
			node: {
				data: {
					get: () => {
						return {
							listStyles: {
								type: 'ordered'
							}
						}
					}
				}
			},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid parents', () => {
		const change = {
			setNodeByKey: jest.fn(),
			moveNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		change.withoutNormalization = jest.fn().mockImplementationOnce(funct => funct(change))

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, PARENT_TYPE_INVALID, {
			node: {
				nodes: [
					{
						type: LIST_LINE_NODE
					},
					{
						type: 'mockNode'
					}
				]
			},
			child: { key: 'mockKey' },
			index: null,
			parent: {
				nodes: {
					indexOf: () => 0
				}
			}
		})

		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in Level', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn(),
			setNodeByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { object: 'block' },
			index: 0
		})

		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid text children in Level', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, CHILD_TYPE_INVALID, {
			node: {},
			child: { object: 'text' },
			index: 0
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in Level', () => {
		const change = {
			insertNodeByKey: jest.fn(),
			wrapBlockByKey: jest.fn()
		}

		List.plugins.schema.blocks[LIST_LEVEL_NODE].normalize(change, CHILD_REQUIRED, {
			node: {},
			child: { object: 'block' },
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})
})
