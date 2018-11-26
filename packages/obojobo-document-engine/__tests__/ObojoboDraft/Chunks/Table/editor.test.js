import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('src/scripts/oboeditor/util/keydown-util')

import Table from 'ObojoboDraft/Chunks/Table/editor'
import KeyDownUtil from 'src/scripts/oboeditor/util/keydown-util'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Table editor', () => {
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
