import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import onBackspace from './on-backspace'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('On Backspace List', () => {
	test('onBackspace does nothing if not empty', () => {
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
				anchor: { path: [0, 0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('onBackspace does nothing if the containing Level has more than 1 child', () => {
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
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('onBackspace removes nodes at top level', () => {
		jest.spyOn(Transforms, 'removeNodes').mockReturnValueOnce(true)
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
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		onBackspace([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.removeNodes).toHaveBeenCalled()
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

		onBackspace([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})
})