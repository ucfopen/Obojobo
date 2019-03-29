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
	test('onPaste calls next only with non-slate content', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'text'
		})

		const mockEvent = {}
		const editor = {
			getLeafMostComponents: jest.fn()
		}
		const next = jest.fn()

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(next).toHaveBeenCalled()
		expect(editor.getLeafMostComponents).not.toHaveBeenCalled()
		expect(KeyDownUtil.deleteEmptyParent).not.toHaveBeenCalled()
	})

	test('onPaste inserts slate nodes into nodes that support children', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'fragment'
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
			getLeafMostComponents: jest.fn().mockReturnValueOnce([
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
		expect(editor.getLeafMostComponents).toHaveBeenCalled()
		expect(editor.insertBlock).toHaveBeenCalled()
		expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()
	})

	test('onPaste inserts slate nodes into nodes that do not support children', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'fragment'
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
			getLeafMostComponents: jest.fn().mockReturnValueOnce([
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

		expect(next).toHaveBeenCalled()
		expect(editor.getLeafMostComponents).not.toHaveBeenCalled()
		expect(editor.insertBlock).not.toHaveBeenCalled()
		expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()
	})

	test('onPaste inserts partial slate nodes into nodes that do not support children', () => {
		getEventTransfer.mockReturnValueOnce({
			type: 'fragment'
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
			getLeafMostComponents: jest.fn().mockReturnValueOnce([
				{
					type: 'oboeditor.component' // block to paste in
				}
			]),
			insertBlock: jest.fn()
		}
		const next = jest.fn().mockImplementation(() => {
			throw new Error()
		})

		// Ensure that the TEXT_NODE does not support Children
		jest.spyOn(Common.Registry, 'getItemForType')
		Common.Registry.getItemForType.mockReturnValueOnce(null)

		ClipboardPlugin.onPaste(mockEvent, editor, next)

		expect(next).toHaveBeenCalled()
		expect(editor.getLeafMostComponents).toHaveBeenCalled()
		expect(editor.insertBlock).toHaveBeenCalled()
		expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()
	})

	test('getLeafMostComponents returns a list of oboeditor.components', () => {
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
			getClosest: (key, fun) => fun('oboeditor.component')
		}
		ClipboardPlugin.queries.getLeafMostComponents(editor, fragment)
	})
})
