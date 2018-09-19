import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import Table from '../../../../ObojoboDraft/Chunks/Table/editor'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Table editor', () => {
	test('Node component', () => {
		const Node = Table.components.Node
		const component = renderer.create(
			<Node
				attributes={{ dummy: 'dummyData' }}
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
				attributes={{ dummy: 'dummyData' }}
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
				attributes={{ dummy: 'dummyData' }}
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
				attributes={{ dummy: 'dummyData' }}
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
		change.collapseToStartOfNextText = jest.fn().mockReturnValueOnce(change)
		change.focus = jest.fn().mockReturnValueOnce(change)

		Table.helpers.insertNode(change)

		expect(change.insertBlock).toHaveBeenCalled()
		expect(change.collapseToStartOfNextText).toHaveBeenCalled()
		expect(change.focus).toHaveBeenCalled()
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
			]
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

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
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

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
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

	test('plugins.renderNode renders a button when passed', () => {
		const props = {
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

	test('plugins.schema.normalize fixes invalid children', () => {
		const change = {
			wrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

	test('plugins.schema.normalize adds missing children', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(change, CHILD_REQUIRED, {
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

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(change, CHILD_TYPE_INVALID, {
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

	test('plugins.schema.normalize adds missing children in Row', () => {
		const change = {
			insertNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(change, CHILD_REQUIRED, {
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
})
