import Common from 'src/scripts/common/index'

import { getEventTransfer } from 'slate-react'
jest.mock('slate-react', () => ({
	getEventTransfer: jest.fn()
}))
import KeyDownUtil from 'src/scripts/oboeditor/util/keydown-util'
jest.mock('src/scripts/oboeditor/util/keydown-util')

import ClipboardPlugin from 'src/scripts/oboeditor/plugins/clipboard-plugin'

const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('ClipboardPlugin', () => {
	test('onPaste calls insertText with non-slate content', () => {
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

		expect(editor.insertText).toHaveBeenCalled()
	})

	test('onPaste calls insertText and insertBlock with non-slate content', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'text',
			text: 'One line of text \n Another line'
		})

		const mockEvent = {}
		const editor = {
			getComponents: jest.fn(),
			insertText: jest.fn(),
			createBlockFromText: jest.fn(),
			insertBlock: jest.fn()
		}
		const next = jest.fn()

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(editor.insertText).toHaveBeenCalled()
		expect(editor.insertBlock).toHaveBeenCalled()
	})

	test('onPaste inserts slate nodes into nodes that support children', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			fragment: 'mockFragment'
		})

		const mockEvent = {}
		const editor = {
			value: {
				blocks: {
					get: () => ({ key: 'mockBlock' }), // current selection
					forEach: fun => {
						fun({ text: '', type: QUESTION_NODE })
						fun({ text: 'mock text', type: QUESTION_NODE })
						fun({ text: '', type: TEXT_LINE_NODE })
					}
				},
				document: {
					getAncestors: () => [
						{
							type: QUESTION_NODE // ancestor that supports children
						}
					]
				}
			},
			getComponents: jest.fn().mockReturnValueOnce([
				{
					type: 'oboeditor.component' // block to paste in
				}
			]),
			insertBlock: jest.fn()
		}
		const next = jest.fn()

		// Ensure that the QUESTION_NODE supportsChildren
		jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce({ supportsChildren: true })

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(next).not.toHaveBeenCalled()
		expect(editor.getComponents).toHaveBeenCalledWith('mockFragment', true)
		expect(editor.insertBlock).toHaveBeenCalled()
		expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()
	})

	test('onPaste inserts slate nodes into nodes that do not support children', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			fragment: 'mockFragment'
		})

		const mockEvent = {}
		const editor = {
			value: {
				blocks: {
					get: () => ({ key: 'mockBlock' }), // current selection
					forEach: fun => {
						fun({ text: '', type: TEXT_LINE_NODE })
						fun({ text: 'mock text', type: TEXT_LINE_NODE })
					}
				},
				document: {
					getAncestors: () => [
						{
							type: TEXT_LINE_NODE // ancestor that supports children
						}
					]
				}
			},
			getComponents: jest.fn().mockReturnValueOnce([
				{
					type: 'oboeditor.component' // block to paste in
				}
			]),
			insertBlock: jest.fn()
		}
		const next = jest.fn()

		// Ensure that the TEXT_NODE does not support Children
		jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce(null)

		// Check that the dummy event works properly
		jest.spyOn(KeyDownUtil, 'deleteEmptyParent')
		KeyDownUtil.deleteEmptyParent.mockImplementationOnce(event => {
			event.preventDefault()
		})

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(next).not.toHaveBeenCalled()
		expect(editor.getComponents).toHaveBeenCalledWith('mockFragment', false)
		expect(editor.insertBlock).toHaveBeenCalled()
		expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()
	})

	test('getComponents returns a list of leaf-most oboeditor.components', () => {
		const editor = {}
		const fragment = {
			getBlocks: () => ({
				map: fun => {
					fun({ type: 'oboeditor.component', key: 'mockKey' })
					fun({ type: 'oboeditor.component', key: 'differentNode' })
					fun({ type: 'mockNode' })

					return {
						get: () => ({ key: 'mockKey' }),
						map: fun => {
							fun({ key: 'mockKey' })
							fun({ key: 'differentNode' })

							return {
								filter: () => [{ type: 'oboeditor.component' }]
							}
						}
					}
				}
			}),
			getClosest: jest.fn().mockImplementationOnce((key, fun) => fun('oboeditor.component')),
			getFurthest: jest.fn().mockImplementationOnce((key, fun) => fun('oboeditor.component'))
		}
		ClipboardPlugin.queries.getComponents(editor, fragment, true)

		expect(fragment.getFurthest).not.toHaveBeenCalled()
		expect(fragment.getClosest).toHaveBeenCalled()
	})

	test('getComponents returns a list of root-most oboeditor.components', () => {
		const editor = {}
		const fragment = {
			getBlocks: () => ({
				map: fun => {
					fun({ type: 'oboeditor.component', key: 'mockKey' })
					fun({ type: 'oboeditor.component', key: 'differentNode' })
					fun({ type: 'mockNode' })

					return {
						get: () => ({ key: 'mockKey' }),
						map: fun => {
							fun({ key: 'mockKey' })
							fun({ key: 'differentNode' })

							return {
								filter: () => [{ type: 'oboeditor.component' }]
							}
						}
					}
				}
			}),
			getClosest: jest.fn().mockImplementationOnce((key, fun) => fun('oboeditor.component')),
			getFurthest: jest.fn().mockImplementationOnce((key, fun) => fun('oboeditor.component'))
		}
		ClipboardPlugin.queries.getComponents(editor, fragment, false)

		expect(fragment.getFurthest).toHaveBeenCalled()
		expect(fragment.getClosest).not.toHaveBeenCalled()
	})

	test('createBlockFromText builds a TEXT_NODE', () => {
		const editor = {}
		const textLine = ['First text line', 'Second text line']
		const blocks = ClipboardPlugin.queries.createBlockFromText(editor, textLine)

		expect(blocks).toMatchSnapshot()
	})
})
