import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import onBackspace from './on-backspace'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('On Backspace List', () => {
	test('onBackspace does nothing if not at start of node', () => {
		ReactEditor.findPath.mockReturnValueOnce([0])
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 3 },
				focus: { path: [0, 0, 0, 0], offset: 3 }
			},
			apply: jest.fn(),
			isVoid: () => false,
			isInline: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('onBackspace does nothing if not at first list item', () => {
		ReactEditor.findPath.mockReturnValueOnce([0])
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: '', b: true }]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 1, 0], offset: 0 },
				focus: { path: [0, 0, 1, 0], offset: 0 }
			},
			apply: jest.fn(),
			isVoid: () => false,
			isInline: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('onBackspace splits at correct location when the containing Level has more than 1 child', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'select').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: '', b: true }]
								},
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0, 0], offset: 0 }
			},
			apply: jest.fn(),
			isVoid: () => false,
			isInline: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0], [0]], editor, event)

		expect(Transforms.removeNodes).toHaveBeenCalled()
		expect(Transforms.removeNodes.mock.calls[0][1]).toEqual({ at: [0, 0, 0] })

		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(Transforms.insertNodes.mock.calls[0][1]).toEqual({
			type: TEXT_NODE,
			children: [
				{
					type: TEXT_NODE,
					subtype: TEXT_LINE_NODE,
					content: { align: 0, indent: 0, hangingIndent: false },
					children: [{ text: '' }]
				}
			]
		})
		expect(Transforms.insertNodes.mock.calls[0][2]).toEqual({ at: [0, 0, 0] })

		expect(Transforms.select).toHaveBeenCalled()
	})

	test('onBackspace removes nodes at top level', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'select').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: '', b: true }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0, 0], offset: 0 }
			},
			apply: jest.fn(),
			isVoid: () => false,
			isInline: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('onBackspace properly moves selection when not on first node', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'select').mockReturnValueOnce(true)
		// Mocks behavior as if it were not the first node
		jest.spyOn(Editor, 'before').mockReturnValueOnce(true)
		jest.spyOn(Editor, 'after').mockReturnValueOnce(false)
		ReactEditor.findPath.mockReturnValueOnce([0])
		const editor = {
			children: [
				{
					id: 'mockKey2',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: '', b: true }]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0, 0], offset: 0 }
			},
			apply: jest.fn(),
			isVoid: () => false,
			isInline: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0], [0]], editor, event)

		expect(Editor.before).toHaveBeenCalledTimes(1)
		expect(Editor.after).toHaveBeenCalledTimes(2)
	})

	test('onBackspace reduces indent', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])
		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: {},
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: {},
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LINE_NODE,
											content: {},
											children: [{ text: '', b: true }]
										}
									]
								}
							]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0, 0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})
})
