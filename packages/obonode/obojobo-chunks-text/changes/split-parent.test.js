import { Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import splitParent from './split-parent'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Split Text Parent', () => {
	test('splitParent does nothing if text is not empty', () => {
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockText', b: true }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn(), isDefaultPrevented: () => false }

		splitParent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('splitParent does nothing if text is not empty', () => {
		const spy = jest.spyOn(Transforms, 'splitNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: '', b: true }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn(), isDefaultPrevented: () => false }

		splitParent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.splitNodes).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('splitParent does nothing if event is prevented', () => {
		const spy = jest.spyOn(Transforms, 'splitNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: '', b: true }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn(), isDefaultPrevented: () => true }

		splitParent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(Transforms.splitNodes).not.toHaveBeenCalled()

		spy.mockRestore()
	})

	test('splitParent does nothing if the selection is not collapsed', () => {
		const transSpy = jest.spyOn(Transforms, 'splitNodes').mockReturnValueOnce(true)
		const rangeSpy = jest.spyOn(Range, 'isCollapsed').mockReturnValueOnce(false)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: '', b: true }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn(), isDefaultPrevented: () => false }

		splitParent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(Transforms.splitNodes).not.toHaveBeenCalled()

		transSpy.mockRestore()
		rangeSpy.mockRestore()
	})
})
