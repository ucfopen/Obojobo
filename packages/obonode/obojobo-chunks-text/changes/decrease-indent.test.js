import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import decreaseIndent from './decrease-indent'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Decrease Text Indent', () => {
	test('decreaseIndent calls Transforms.setNodes', () => {
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
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		decreaseIndent([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{ content: { indent: 0} },
			{ at: [0, 0] }
		)
	})
})