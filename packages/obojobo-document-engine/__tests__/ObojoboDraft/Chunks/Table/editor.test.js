import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

jest.mock('src/scripts/oboeditor/util/keydown-util')

import Table from 'ObojoboDraft/Chunks/Table/editor'
import KeyDownUtil from 'src/scripts/oboeditor/util/keydown-util'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Table editor', () => {
	test('plugins.onKeyDown deals with no table', () => {
		const editor = {
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
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random key press', () => {
		const editor = {
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
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'K',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const editor = {
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

		Table.plugins.onKeyDown(event, editor, jest.fn())
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace]', () => {
		const editor = {
			value: {
				document: {
					getClosest: () => true
				},
				blocks: [{ key: 'mockKey' }]
			}
		}
		const event = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown(event, editor, jest.fn())
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Delete]', () => {
		const editor = {
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

		Table.plugins.onKeyDown(event, editor, jest.fn())
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

		expect(Table.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Table.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Table.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Table.plugins.renderNode(props, null, next)).toMatchSnapshot()
	})

	test('plugins.schema.normalize fixes invalid children in table', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(editor, {
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

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in table', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(editor, {
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

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block at end of table', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(editor, {
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

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in table', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_NODE].normalize(editor, {
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

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in Row', () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(editor, {
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

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block in Row', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(editor, {
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

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block at end of Row', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(editor, {
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

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds missing children in Row', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_ROW_NODE].normalize(editor, {
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

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid children in Cell', () => {
		const editor = {
			unwrapBlockByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_CELL_NODE].normalize(editor, {
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

		expect(editor.unwrapBlockByKey).not.toHaveBeenCalled()
	})

	test('plugins.schema.normalize fixes invalid block at end of Cell', () => {
		const editor = {
			unwrapNodeByKey: jest.fn()
		}

		Table.plugins.schema.blocks[TABLE_CELL_NODE].normalize(editor, {
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

		expect(editor.unwrapNodeByKey).toHaveBeenCalled()
	})
})
