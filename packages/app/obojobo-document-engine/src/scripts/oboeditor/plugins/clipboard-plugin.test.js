import { Transforms } from 'slate'
jest.mock('slate')

import ClipboardPlugin from './clipboard-plugin'

describe('ClipboardPlugin', () => {
	test('insertData calls next with Slate content', () => {
		const mockData = {
			types: ['application/x-slate-fragment']
		}
		const editor = {
			getComponents: jest.fn(),
			insertText: jest.fn()
		}
		const next = jest.fn()

		ClipboardPlugin.insertData(mockData, editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('insertData inserts a Text Node', () => {
		const mockData = {
			types: ['text/plain'],
			getData: () => 'line1\nline2'
		}
		const editor = {
			insertFragment: jest.fn()
		}
		const next = jest.fn()

		ClipboardPlugin.insertData(mockData, editor, next)
		expect(Transforms.insertFragment).toHaveBeenCalledWith(editor, [
			{
				type: 'ObojoboDraft.Chunks.Text',
				content: {},
				children: [
					{
						type: 'ObojoboDraft.Chunks.Text',
						subtype: 'ObojoboDraft.Chunks.Text.TextLine',
						content: {
							align: 'left',
							indent: 0
						},
						children: [{ text: 'line1' }]
					},
					{
						type: 'ObojoboDraft.Chunks.Text',
						subtype: 'ObojoboDraft.Chunks.Text.TextLine',
						content: {
							align: 'left',
							indent: 0
						},
						children: [{ text: 'line2' }]
					}
				]
			}
		])
	})
})
