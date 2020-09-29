import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import indentOrTab from './indent-or-tab'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Increase Text Indent', () => {
	test('indentOrTab calls Transforms.setNodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
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
						},
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
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 1, 0], offset: 1 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		indentOrTab([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{ content: { indent: 2 } },
			{ at: [0, 0] }
		)
	})

	test('indentOrTab calls insertText', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
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
			isVoid: () => false,
			insertText: jest.fn()
		}
		const event = { preventDefault: jest.fn() }

		indentOrTab([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(editor.insertText).toHaveBeenCalled()
	})
})
