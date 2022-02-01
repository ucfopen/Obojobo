import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
import { Transforms } from 'slate'

import Table from './editor-registration'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

describe('Table editor', () => {
	test('insertData calls next if pasting a Slate fragment', () => {
		const data = {
			types: ['application/x-slate-fragment']
		}
		const next = jest.fn()

		Table.plugins.insertData(data, {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('insertData calls next if not pasting into Table', () => {
		const data = {
			types: ['application/html']
		}
		const next = jest.fn()

		Table.plugins.insertData(
			data,
			{
				children: [
					{
						type: 'nonTableNode',
						children: [{ text: '' }]
					}
				],
				selection: {
					anchor: { path: [0, 0], offset: 0 },
					focus: { path: [0, 0], offset: 0 }
				}
			},
			next
		)

		expect(next).toHaveBeenCalled()
	})

	test('insertData inserts all lines as Table Rows if pasting into Table', () => {
		jest.spyOn(Transforms, 'insertFragment').mockReturnValueOnce(true)

		const data = {
			types: ['application/html'],
			getData: () => 'line1 \n line2'
		}
		const next = jest.fn()

		Table.plugins.insertData(
			data,
			{
				type: TABLE_NODE,
				children: [
					{
						type: TABLE_NODE,
						children: [{ text: 'mocktext' }]
					}
				],
				selection: {
					anchor: { path: [0, 0], offset: 1 },
					focus: { path: [0, 0], offset: 1 }
				}
			},
			next
		)

		expect(Transforms.insertFragment).toHaveBeenCalled()
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

		Table.plugins.onKeyDown([{}, [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter], [ArrowDown], [ArrowUp] and expanded selection on one child', () => {
		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 3 }
			},
			isInline: () => false
		}
		let event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowDown',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowUp',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter], [ArrowDown], [ArrowUp] and collapsed selection on one child', () => {
		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		let event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowDown',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowUp',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter], [ArrowDown], [ArrowUp] and collapsed selection on multiple children', () => {
		jest.spyOn(Transforms, 'setSelection').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext2' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		let event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.setSelection).toHaveBeenCalled()

		jest.spyOn(Transforms, 'setSelection').mockReturnValueOnce(true)

		event = {
			key: 'ArrowDown',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.setSelection).toHaveBeenCalled()

		event = {
			key: 'ArrowUp',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab], [ArrowLeft], [ArrowRight], [Shift+Tab] and expanded selection on one child', () => {
		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 3 }
			},
			isInline: () => false
		}
		let event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowRight',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowLeft',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab], [ArrowLeft], [ArrowRight], [Shift+Tab] and collapsed selection on one child', () => {
		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		let event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		event = {
			key: 'ArrowRight',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		event = {
			key: 'ArrowLeft',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab], [ArrowLeft], [ArrowRight], [Shift+Tab] and collapsed selection on multiple children', () => {
		jest.spyOn(Transforms, 'setSelection').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext2' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		let event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		event = {
			key: 'ArrowRight',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		event = {
			key: 'ArrowLeft',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab], [ArrowRight] and expanded selection at end of row', () => {
		jest.spyOn(Transforms, 'setSelection').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext2' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0, 0], offset: 5 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		let event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()

		event = {
			key: 'ArrowRight',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Shift+Tab] and expanded selection at beginning of row', () => {
		jest.spyOn(Transforms, 'setSelection').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext2' }]
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 1, 0, 0], offset: 1 },
				focus: { path: [0, 1, 0, 0], offset: 5 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [ArrowLeft] and expanded selection at beginning of row', () => {
		jest.spyOn(Transforms, 'setSelection').mockReturnValueOnce(true)

		const editor = {
			children: [
				{
					type: TABLE_NODE,
					content: {},
					children: [
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						},
						{
							type: TABLE_NODE,
							subtype: TABLE_ROW_NODE,
							children: [
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext2' }]
								},
								{
									type: TABLE_NODE,
									subtype: TABLE_CELL_NODE,
									children: [{ text: 'mocktext1' }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 1, 0, 0], offset: 1 },
				focus: { path: [0, 1, 0, 0], offset: 5 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		const event = {
			key: 'ArrowLeft',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([editor.children[0], [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace]', () => {
		const event = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([{}, [0]], {}, event)
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Delete]', () => {
		const event = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Table.plugins.onKeyDown([{}, [0]], {}, event)
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.renderNode renders a Table when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: TABLE_NODE
			}
		}

		expect(Table.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a row when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				subtype: TABLE_ROW_NODE
			}
		}

		expect(Table.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a cell when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				subtype: TABLE_CELL_NODE
			}
		}

		expect(Table.plugins.renderNode(props)).toMatchSnapshot()
	})
})
