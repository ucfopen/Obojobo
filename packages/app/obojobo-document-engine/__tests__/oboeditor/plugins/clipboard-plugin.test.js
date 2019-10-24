import Common from 'src/scripts/common/index'
import { Block } from 'slate'

import { getEventTransfer } from 'slate-react'
jest.mock('slate-react', () => ({
	getEventTransfer: jest.fn()
}))

import ClipboardPlugin from 'src/scripts/oboeditor/plugins/clipboard-plugin'

describe('ClipboardPlugin', () => {
	test('onPaste calls next with non-slate content', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'text',
			text: 'One line of text'
		})

		const mockEvent = {}
		const editor = {
			getComponents: jest.fn(),
			insertText: jest.fn()
		}
		const next = jest.fn()

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('onPaste calls common registry with slate content', () => {
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce({
			getPasteNode: node => Block.create(node)
		}).mockReturnValueOnce({
			getPasteNode: node => [Block.create(node),Block.create(node)]
		})

		getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			text: 'One line of text \n Another line',
			fragment: {
				nodes: [
					{
						object: 'block',
						type: 'mockNode'
					},
					{
						object: 'block',
						type: 'mockNode2'
					}
				]
			}
		})

		const mockEvent = {}
		const editor = {
			insertFragment: jest.fn()
		}
		const next = jest.fn()

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(spy).toHaveBeenCalledTimes(2)
		expect(editor.insertFragment).toHaveBeenCalled()
	})
})
