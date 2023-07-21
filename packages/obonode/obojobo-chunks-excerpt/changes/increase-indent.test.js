import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import increaseIndent from './increase-indent'

const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.ExcerptLine'

describe('Increase Code Indent', () => {
	test('increaseIndent calls Transforms.setNodes', () => {
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
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		increaseIndent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{ content: { indent: 2 } },
			{ at: [0, 0] }
		)
	})
})
