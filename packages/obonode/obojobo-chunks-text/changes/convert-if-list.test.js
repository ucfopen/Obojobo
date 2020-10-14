import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import convertIfList from './convert-if-list'
import looksLikeListItem from '../../obojobo-chunks-list/list-detector'
jest.mock('../../obojobo-chunks-list/list-detector')

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const LIST_NODE = 'ObojoboDraft.Chunks.List'

describe('Convert Text to List', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('convertIfList ignores regular text', () => {
		jest.spyOn(Transforms, 'delete').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'removeNodes').mockReturnValue(true)
		ReactEditor.findPath.mockReturnValueOnce([0])
		looksLikeListItem.mockReturnValueOnce(false)

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
							content: {},
							children: [{ text: 'mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 0 },
				focus: { path: [0, 0, 0], offset: 8 }
			},
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn()
		}
		const event = { preventDefault: jest.fn() }

		convertIfList([editor.children[0], [0]], editor, event)

		expect(looksLikeListItem).toHaveBeenCalled()
		expect(Transforms.delete).not.toHaveBeenCalled()
		expect(Transforms.insertNodes).not.toHaveBeenCalled()
		expect(Transforms.removeNodes).not.toHaveBeenCalled()
	})

	test('convertIfList inserts a List node with correct text', () => {
		jest.spyOn(Transforms, 'delete').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'removeNodes').mockReturnValue(true)
		ReactEditor.findPath.mockReturnValueOnce([0])
		looksLikeListItem.mockReturnValueOnce({ type: 'mockType' })

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
							content: {},
							children: [{ text: 'mockText' }]
						},
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: {},
							children: [{ text: '*mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 1, 0], offset: 1 },
				focus: { path: [0, 1, 0], offset: 1 }
			},
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn()
		}
		const event = { preventDefault: jest.fn() }

		convertIfList([editor.children[0], [0]], editor, event)

		expect(looksLikeListItem).toHaveBeenCalled()
		expect(Transforms.delete).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(Transforms.removeNodes).toHaveBeenCalledTimes(1)

		const deletedRange = Transforms.delete.mock.calls[0][1].at
		expect(deletedRange).toEqual({
			anchor: {
				path: [0, 1, 0],
				offset: 1
			},
			focus: {
				path: [0, 1, 0],
				offset: 9
			}
		})

		const insertedNode = Transforms.insertNodes.mock.calls[0][1]
		expect(insertedNode.type).toBe(LIST_NODE)
		expect(insertedNode.children[0].children[0].text).toBe('mockText')

		const removedRange = Transforms.removeNodes.mock.calls[0][1].at
		expect(removedRange).toEqual({
			anchor: {
				path: [0, 1, 0],
				offset: 0
			},
			focus: {
				path: [0, 1, 0],
				offset: 1
			}
		})
	})

	test('convertIfList removes text node if only one child', () => {
		jest.spyOn(Transforms, 'delete').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'insertNodes').mockReturnValueOnce(true)
		jest.spyOn(Transforms, 'removeNodes').mockReturnValue(true)
		ReactEditor.findPath.mockReturnValueOnce([0])
		looksLikeListItem.mockReturnValueOnce({ type: 'mockType' })

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
							content: {},
							children: [{ text: '*mockText' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0, 0, 0], offset: 2 },
				focus: { path: [0, 0, 0], offset: 2 }
			},
			isInline: () => false,
			isVoid: () => false,
			apply: jest.fn()
		}
		const event = { preventDefault: jest.fn() }

		convertIfList([editor.children[0], [0]], editor, event)

		expect(looksLikeListItem).toHaveBeenCalled()
		expect(Transforms.delete).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()
		expect(Transforms.removeNodes).toHaveBeenCalledTimes(2)

		const removedNode = Transforms.removeNodes.mock.calls[1][1].at
		expect(removedNode).toEqual([0])
	})
})
