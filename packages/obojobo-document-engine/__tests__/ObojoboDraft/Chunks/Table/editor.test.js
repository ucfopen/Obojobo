import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('src/scripts/oboeditor/util/keydown-util')

import Table from 'ObojoboDraft/Chunks/Table/editor'
import KeyDownUtil from 'src/scripts/oboeditor/util/keydown-util'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Table editor', () => {
	test('Node component', () => {
		const Node = Table.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { textGroup: { textGroup: [] } }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component removes col', () => {
		const Node = Table.components.Node

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return { textGroup: { textGroup: [], numCols: 1 } }
						}
					},
					nodes: [
						{
							nodes: {
								get: () => {
									return {
										key: 'deletedCell'
									}
								}
							}
						}
					]
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

	test('Node component adds row', () => {
		const Node = Table.components.Node

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return { textGroup: { numRows: 1, numCols: 2 } }
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
			.at(2) // Need to skip an extra button for the extra column
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles header', () => {
		const Node = Table.components.Node

		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return { textGroup: { numCols: 1 } }
						}
					},
					nodes: {
						get: () => {
							return {
								data: {
									get: () => ({
										header: true
									})
								},
								key: 'topRow',
								nodes: [
									{
										key: 'mockCell'
									}
								]
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
		const tree = component.html()

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Node component adds col', () => {
		const Node = Table.components.Node

		const change = {
			insertNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return { textGroup: { numCols: 1 } }
						}
					},
					nodes: [
						{
							data: {
								get: () => {
									return {
										header: true
									}
								}
							}
						}
					]
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
			.at(2)
			.simulate('click')

		expect(change.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Row component', () => {
		const Node = Table.components.Row
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { header: false }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Row component deletes itself and its table', () => {
		const Node = Table.components.Row

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={{
					value: {
						change: () => change,
						document: {
							getDescendant: () => {
								return {
									data: {
										get: () => {
											return {
												textGroup: {
													numRows: 2
												}
											}
										}
									},
									nodes: {
										get: num => {
											if (num === 1) return null
											return {
												key: 'thisRow'
											}
										}
									}
								}
							}
						}
					},
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

	test('Row component deletes itself', () => {
		const Node = Table.components.Row

		const change = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={{
					value: {
						change: () => change,
						document: {
							getDescendant: () => {
								return {
									data: {
										get: () => {
											return {
												textGroup: {
													numRows: 2
												}
											}
										}
									},
									nodes: {
										get: () => {
											return {
												key: 'notThisRow'
											}
										}
									}
								}
							}
						}
					},
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

	test('Row component deletes itself and passes header status to sibling', () => {
		const Node = Table.components.Row

		const change = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<Node
				node={{
					key: 'thisRow'
				}}
				parent={{
					key: 'table'
				}}
				editor={{
					value: {
						change: () => change,
						document: {
							getDescendant: () => {
								return {
									// parent
									data: {
										get: () => {
											return {
												header: true,
												textGroup: {
													numRows: 2
												}
											}
										}
									},
									nodes: {
										get: () => {
											return {
												key: 'thisRow',
												nodes: [
													{
														key: 'siblingCell'
													}
												]
											}
										}
									}
								}
							}
						}
					},
					onChange: jest.fn()
				}}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(change.setNodeByKey).toHaveBeenCalled()
		expect(change.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('Cell component', () => {
		const Node = Table.components.Cell
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { header: false }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component as header', () => {
		const Node = Table.components.Cell
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return { header: true }
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
		change.focus = jest.fn().mockReturnValueOnce(change)

		Table.helpers.insertNode(change)

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
			nodes: {
				get: () => ({
					data: {
						get: () => ({ header: true })
					}
				}),
				forEach: funct => {
					funct({
						nodes: [
							{
								text: 'MockText',
								nodes: [
									{
										leaves: [
											{
												text: 'MockText',
												marks: [
													{
														type: 'b',
														data: {
															toJSON: () => true
														}
													}
												]
											}
										]
									}
								]
							}
						]
					})
				}
			}
		}
		const oboNode = Table.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {
				header: true,
				textGroup: {
					numCols: 2,
					textGroup: [
						{
							text: { value: 'Mock1' }
						},
						{
							text: { value: 'Mock2' }
						},
						{
							text: { value: 'Mock3' }
						},
						{
							text: { value: 'Mock4' }
						}
					]
				}
			}
		}
		const slateNode = Table.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no table', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random key press', () => {
		const change = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: TABLE_NODE })
						return true
					}
				}
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'K',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const change = {
			value: {
				document: {
					getClosest: () => true
				},
				blocks: [{ key: 'mockKey' }]
			}
		}
		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, change)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete]', () => {
		const change = {
			value: {
				document: {
					getClosest: () => true
				},
				blocks: [{ key: 'mockKey' }]
			}
		}
		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, change)
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a Table when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: TABLE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Table.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a row when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: TABLE_ROW_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Table.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a cell when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: TABLE_CELL_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Table.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children in table', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				}
			},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in table', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				},
				nodes: { size: 3 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(change.removeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block at end of table', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				},
				nodes: { size: 10 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 9
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in table', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				}
			},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in Row', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				}
			},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in Row', () => {
		const change = {
			removeNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				},
				nodes: { size: 3 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 0
		})

		expect(change.removeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block at end of Row', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				},
				nodes: { size: 10 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 9
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in Row', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(change, {
			code: CHILD_REQUIRED,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				}
			},
			child: null,
			index: 0
		})

		expect(change.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in Cell', () => {
		const change = {
			unwrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_CELL_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				}
			},
			child: { key: 'mockKey' },
			index: null
		})

		expect(change.unwrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block at end of Cell', () => {
		const change = {
			unwrapNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_CELL_NODE].normalize(change, {
			code: CHILD_TYPE_INVALID,
			node: {
				data: {
					get: () => {
						return { header: 'mockHeader' }
					}
				},
				nodes: { size: 10 }
			},
			child: { object: 'block', key: 'mockKey' },
			index: 9
		})

		expect(change.unwrapNodeByKey).toHaveBeenCalled()
	})
})
