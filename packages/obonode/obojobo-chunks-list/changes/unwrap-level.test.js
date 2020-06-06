import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import unwrapLevel from './unwrap-level'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('List Unwrap Level', () => {
	test('unwrapLevel calls Transforms.liftNodes', () => {
		jest.spyOn(Transforms, 'liftNodes').mockImplementation((editor, opts) => {
			opts.match({})
		})
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

		unwrapLevel([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})
})
