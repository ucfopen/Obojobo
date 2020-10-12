import { Transforms, Point } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import KeyDownUtil from 'src/scripts/oboeditor/util/keydown-util'

describe('KeyDown Util', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	test('deleteEmptyParent', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValue(true)
		jest.spyOn(Transforms, 'move').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: '' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false
		}

		const event = {
			preventDefault: jest.fn()
		}

		expect(KeyDownUtil.deleteEmptyParent(event, editor, [editor.children[0], [0]], false))
		expect(event.preventDefault).toHaveBeenCalledTimes(1)
		expect(Transforms.removeNodes).toHaveBeenCalledTimes(1)

		expect(KeyDownUtil.deleteEmptyParent(event, editor, [editor.children[0], [0]], true))
		expect(event.preventDefault).toHaveBeenCalledTimes(2)
		expect(Transforms.removeNodes).toHaveBeenCalledTimes(2)
		expect(Transforms.move).toHaveBeenCalledTimes(1)

		editor.children = [
			{
				type: 'mockNode',
				children: [
					{
						type: 'mockChildNode',
						children: [{ text: 'mockText' }]
					}
				]
			}
		]
		/* eslint-disable-next-line */
		expect(KeyDownUtil.deleteEmptyParent(event, editor, [editor.children[0], [0]], true))
		expect(event.preventDefault).toHaveBeenCalledTimes(2)
		expect(Transforms.removeNodes).toHaveBeenCalledTimes(2)

		editor.isVoid = () => true

		/* eslint-disable-next-line */
		expect(KeyDownUtil.deleteEmptyParent(event, editor, [editor.children[0], [0]], true))
		expect(event.preventDefault).toHaveBeenCalledTimes(2)
		expect(Transforms.removeNodes).toHaveBeenCalledTimes(2)
	})

	test('deleteNodeContents deals with selection outside of table', () => {
		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				},
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				},
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [2, 0, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([1])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[1], [1]], false)
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('deleteNodeContents deals with delete backward selection collapsed at start of block', () => {
		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0], offset: 0 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[0], [0]], false)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('deleteNodeContents deals with delete forward selection collapsed at end of block', () => {
		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 4 },
				focus: { path: [0, 0, 0], offset: 4 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[0], [0]], true)
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('deleteNodeContents deals with delete forward selection collapsed in block', () => {
		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 3 },
				focus: { path: [0, 0, 0], offset: 3 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[0], [0]], true)
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('deleteNodeContents deals with selection inside cell', () => {
		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0], offset: 5 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[0], [0]])

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('deleteNodeContents deals with selection across cells', () => {
		jest.spyOn(Transforms, 'delete').mockReturnValue(true)
		jest.spyOn(Transforms, 'collapse').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						},
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 1, 0], offset: 5 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[0], [0]])

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.delete).toHaveBeenCalled()
		expect(Transforms.collapse).toHaveBeenCalled()
	})

	test('deleteNodeContents deals with selection across cells deleting forward', () => {
		jest.spyOn(Transforms, 'delete').mockReturnValue(true)
		jest.spyOn(Transforms, 'collapse').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						},
						{
							type: 'mockChildNode',
							children: [{ text: 'some text content' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 1, 0], offset: 5 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.deleteNodeContents(event, editor, [editor.children[0], [0]], true)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.delete).toHaveBeenCalled()
		expect(Transforms.collapse).toHaveBeenCalled()
	})

	test('breakToText inserts text', () => {
		jest.spyOn(Transforms, 'insertNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [{ text: 'some' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 4 },
				focus: { path: [0, 0], offset: 4 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.breakToText(event, editor, [editor.children[0], [0]], true)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()

		// make sure the inserted node is correct type
		const insertedNode = Transforms.insertNodes.mock.calls[0][1]
		expect(insertedNode.children[0]).toHaveProperty('type', 'ObojoboDraft.Chunks.Text')
		expect(insertedNode.children[0]).toHaveProperty('subtype', 'ObojoboDraft.Chunks.Text.TextLine')
		expect(insertedNode.children[0].children[0]).toEqual({ text: '' })
	})

	test('breakToText skips when multile node are selected', () => {
		jest.spyOn(Point, 'isBefore').mockReturnValue(false)
		jest.spyOn(Point, 'equals').mockReturnValue(false)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [{ text: 'some' }]
				}
			],
			selection: {
				anchor: { path: [0, 0], offset: 4 },
				focus: { path: [0, 0], offset: 4 }
			},
			isInline: () => false,
			isVoid: () => false
		}
		ReactEditor.findPath.mockReturnValueOnce([0])

		const event = {
			preventDefault: jest.fn()
		}

		KeyDownUtil.breakToText(event, editor, [editor.children[0], [0]], true)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.insertNodes).not.toHaveBeenCalled()
	})
})
