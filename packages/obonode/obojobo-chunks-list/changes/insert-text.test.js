import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import insertText from './insert-text'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('List Insert Text', () => {
	test('insertText calls Transforms.setNodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					type: LIST_NODE,
					subtype: LIST_LINE_NODE,
					content: { indent: 1 },
					children: [{ text: '', b: true }]
				}
			],
			selection: { 
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		insertText(editor.children[0], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{
				type: TEXT_NODE,
				content: {},
				subtype: ''
			},
			{ at: [0] }
		)
	})
})