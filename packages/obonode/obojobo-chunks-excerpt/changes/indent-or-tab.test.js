import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import indentOrTab from './indent-or-tab'

const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.ExcerptLine'

describe('Increase Code Indent', () => {
	test('indentOrTab calls Transforms.setNodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: EXCERPT_NODE,
					content: {},
					children: [
						{
							type: EXCERPT_NODE,
							subtype: EXCERPT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockText' }]
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
					type: EXCERPT_NODE,
					content: {},
					children: [
						{
							type: EXCERPT_NODE,
							subtype: EXCERPT_LINE_NODE,
							content: { indent: 1 },
							children: [{ text: 'mockCode', b: true }]
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
