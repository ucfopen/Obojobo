import { Transforms } from 'slate'
jest.mock('slate')

import splitParent from './split-parent'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Split Text Parent', () => {
	test('splitParent does nothing if default event is prevented', () => {
		const editor = {
			children: [],
			selection: {
				anchor: { path: [0, 0, 0], offset: 1 },
				focus: { path: [0, 0, 0], offset: 1 }
			},
			isVoid: () => false
		}
		const event = { isDefaultPrevented: () => true, preventDefault: jest.fn() }

		splitParent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('splitParent calls splitNodes', () => {
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
		const event = { isDefaultPrevented: () => false, preventDefault: jest.fn() }

		splitParent([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.splitNodes).toHaveBeenCalled()
	})
})
