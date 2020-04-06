import { Transforms } from 'slate'
jest.mock('slate-react')
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/normalize-util')

import normalizeNode from './normalize-node'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Normalize Table', () => {
	test('normalizeNode calls next if the node is not a Table node', () => {
		const next = jest.fn()
		normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Table calls next if all Table children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on Table calls NormalizeUtil to wrap loose Table Cells', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_CELL_NODE,
							content: { header: false},
							children: [{ text: 'mockTable', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0])
		})
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('normalizeNode on Table calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: 'invalidChild',
							subtype: 'invalidChild',
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Table calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: true },
					children: [{ text: 'mockTable', b: true }]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Table calls Transforms if children cols is less than cols', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 2, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalledWith(editor, expect.any(Object), { at: [0,0] })
	})

	test('normalizeNode on Table calls Transforms if children cols is greater than cols', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 2, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalledWith(editor, expect.any(Object), { at: [0] })
	})

	test('normalizeNode on Table calls Transforms if children header dosent match header', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalledWith(editor, expect.any(Object), { at: [0,0] })
	})

	test('normalizeNode on Table calls Transforms if children header is set on non-first row', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 2, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false },
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalledWith(editor, expect.any(Object), { at: [0,1] })
	})

	test('normalizeNode on Table calls Transforms if children is less than rows', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 2, header: true },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: true },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: true },
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on Table calls Transforms if children is greater than rows', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0], [0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalledWith(editor, expect.any(Object), { at: [0] })
	})

	test('normalizeNode on TableRow calls next if all TableRow children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls Transforms on TableRow Children', () => {
		jest.spyOn(Transforms, 'moveNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_ROW_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.moveNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: 'invalidNode',
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls Transforms on invalid Text children', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [{ text: 'mockTable', b: true }]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls Transforms to maintain header', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: true },
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls Transforms if children are less than attributes', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 2, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls Transforms if children are greater than attributes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0], [0, 0]], editor, next)

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableRow calls NormalizeUtil if parent is invalid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: 'invalidNode',
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0].children[0])
		})
		
		normalizeNode([editor.children[0].children[0], [0,0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})

	test('normalizeNode on TableCell calls next if all TableCell children are valid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0].children[0], [0, 0, 0]], editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('normalizeNode on TableLine calls Transforms on invalid Element children', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [
										{
											type: 'invalidNode',
											children: [{ text: 'mockTable', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		normalizeNode([editor.children[0].children[0].children[0], [0, 0, 0]], editor, next)

		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('normalizeNode on TableCell calls NormalizeUtil if parent is invalid', () => {
		const next = jest.fn()
		const editor= {
			children: [
				{
					id: 'mockKey',
					type: TABLE_NODE,
					content: { numCols: 1, numRows: 1, header: false },
					children: [
						{
							type: 'invalidNode',
							subtype: 'invalidNode',
							content: { numCols: 1, header: false },
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									content: { header: false},
									children: [{ text: 'mockTable', b: true }]
								}
							]
						}
					]
				}
			],
			isInline: () => false
		}
		NormalizeUtil.wrapOrphanedSiblings.mockImplementation((editor, entry, wrapper, match) => {
			match(editor.children[0].children[0].children[0])
		})
		
		normalizeNode([editor.children[0].children[0].children[0], [0,0,0]], editor, next)

		expect(NormalizeUtil.wrapOrphanedSiblings).toHaveBeenCalled()
	})
})