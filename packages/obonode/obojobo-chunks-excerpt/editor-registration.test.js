jest.mock('slate')
jest.mock('slate-react')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
jest.mock('./changes/increase-indent')
jest.mock('./changes/decrease-indent')
jest.mock('./changes/indent-or-tab')

import { Editor, Element, Node, Text, Transforms } from 'slate'
import decreaseIndent from './changes/decrease-indent'
import increaseIndent from './changes/increase-indent'
import indentOrTab from './changes/indent-or-tab'
import emptyNode from './empty-node.json'
import Excerpt from './editor-registration'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_CONTENT = 'ObojoboDraft.Chunks.Excerpt.ExcerptContent'
const CITE_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationText'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Excerpt editor', () => {
	describe('insertData', () => {
		test('calls next if pasting a Slate fragment', () => {
			const data = {
				types: ['application/x-slate-fragment']
			}
			const next = jest.fn()

			Excerpt.plugins.insertData(data, {}, next)

			expect(next).toHaveBeenCalled()
		})

		test('calls next if not pasting into Code', () => {
			const data = {
				types: ['application/html']
			}
			const next = jest.fn()
			Editor.nodes.mockImplementation((editor, { match }) => {
				match({ type: 'nonExcerptNode' })
				return [[{ type: 'nonExcerptNode' }]]
			})

			Excerpt.plugins.insertData(data, {}, next)

			expect(next).toHaveBeenCalled()
		})

		test('inserts all lines as TextLines if pasting into Code', () => {
			const data = {
				types: ['application/html'],
				getData: () => 'line1 \n line2'
			}
			const next = jest.fn()
			Editor.nodes.mockReturnValueOnce([[{ type: TEXT_NODE }]])

			Excerpt.plugins.insertData(data, {}, next)

			expect(Transforms.insertFragment).toHaveBeenCalledWith({}, [
				{
					type: TEXT_NODE,
					subtype: TEXT_LINE_NODE,
					content: { indent: 0, hangingIndent: false },
					children: [{ text: 'line1 ' }]
				},
				{
					type: TEXT_NODE,
					subtype: TEXT_LINE_NODE,
					content: { indent: 0, hangingIndent: false },
					children: [{ text: ' line2' }]
				}
			])
		})
	})

	describe('renderNode', () => {
		test('renders excerpt when passed', () => {
			const props = {
				attributes: { dummy: 'dummyData' },
				element: {
					type: EXCERPT_NODE,
					content: {}
				}
			}

			expect(Excerpt.plugins.renderNode(props)).toMatchSnapshot()
		})

		test('renders excerpt content when passed', () => {
			const props = {
				attributes: { dummy: 'dummyData' },
				element: {
					type: EXCERPT_NODE,
					subtype: EXCERPT_CONTENT,
					content: {}
				}
			}

			expect(Excerpt.plugins.renderNode(props)).toMatchSnapshot()
		})

		test('renders excerpt citation text when passed', () => {
			const props = {
				attributes: { dummy: 'dummyData' },
				element: {
					type: EXCERPT_NODE,
					subtype: CITE_TEXT_NODE,
					content: {},
					children: [{ text: 'citation text' }]
				}
			}
			expect(Excerpt.plugins.renderNode(props)).toMatchSnapshot()
		})
	})

	describe('decorate', () => {
		test('renders no placeholders when not relevent', () => {
			const placeholders = Excerpt.plugins.decorate([{ text: 'mock text' }], {})

			expect(placeholders).toEqual([])
		})

		test('renders placeholder citation text', () => {
			const editor = {
				children: [{ children: [{ text: '' }] }]
			}

			const node = {
				type: EXCERPT_NODE,
				subtype: CITE_TEXT_NODE,
				children: [{ text: '' }]
			}

			const point = { key: 'pointKey' }

			Element.isElement.mockReturnValue(true)
			Node.string.mockReturnValue('')
			Editor.start.mockReturnValue(point)

			const actualPlaceholders = Excerpt.plugins.decorate([node, [0]], editor)

			expect(actualPlaceholders).toEqual([
				{
					placeholder: 'Type your optional citation here',
					anchor: point,
					focus: point
				}
			])
		})
	})

	describe('onKeyDown', () => {
		test('deals with [Shift]+[Tab]', () => {
			const event = {
				key: 'Tab',
				shiftKey: true,
				preventDefault: jest.fn()
			}

			Excerpt.plugins.onKeyDown([{}, [0]], {}, event)

			expect(decreaseIndent).toHaveBeenCalled()
		})

		test('deals with [Alt]+[Tab]', () => {
			const event = {
				key: 'Tab',
				altKey: true,
				preventDefault: jest.fn()
			}

			Excerpt.plugins.onKeyDown([{}, [0]], {}, event)

			expect(increaseIndent).toHaveBeenCalled()
		})

		test('deals with [Tab]', () => {
			const event = {
				key: 'Tab',
				preventDefault: jest.fn()
			}

			Excerpt.plugins.onKeyDown([{}, [0]], {}, event)

			expect(indentOrTab).toHaveBeenCalled()
		})

		test('deals with [Enter]', () => {
			const event = {
				key: 'Enter',
				preventDefault: jest.fn()
			}

			Excerpt.plugins.onKeyDown([{}, [0]], {}, event)

			expect(event.preventDefault).toHaveBeenCalled()
			expect(KeyDownUtil.breakToText).not.toHaveBeenCalled()
		})

		test('deals with [Delete]', () => {
			const editor = {
				selection: {
					anchor: {
						path: [0, 0],
						offset: 0
					}
				},
				children: []
			}

			const event = {
				key: 'Delete',
				preventDefault: jest.fn()
			}
			// entry is the whole excerpt
			let mockEntry = {
				children: [
					// the first child is the ExcerptContent - we don't care about that here
					{},
					// the second child is the citation text
					{ children: [{ text: 'mockText' }] }
				]
			}

			Excerpt.plugins.onKeyDown([mockEntry, [0]], editor, event)
			expect(event.preventDefault).not.toHaveBeenCalled()
			expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()

			KeyDownUtil.deleteEmptyParent.mockReset()

			mockEntry = {
				children: [{}, { children: [{ text: '' }] }]
			}

			Excerpt.plugins.onKeyDown([mockEntry, [0]], editor, event)
			expect(event.preventDefault).toHaveBeenCalledTimes(1)
			expect(KeyDownUtil.deleteEmptyParent).not.toHaveBeenCalled()
		})

		test('deals with [Backspace]', () => {
			const event = {
				key: 'Backspace',
				preventDefault: jest.fn()
			}

			// entry is the whole excerpt
			const mockEntry = {
				children: [
					// the first child is the ExcerptContent - we don't care about that here
					{},
					// the second child is the citation text
					{ children: [{ text: 'mockText' }] }
				]
			}

			let editor = {
				selection: {
					focus: {
						path: [0, 0],
						offset: 1
					}
				},
				children: []
			}

			Excerpt.plugins.onKeyDown([mockEntry, [0]], editor, event)
			expect(event.preventDefault).not.toHaveBeenCalled()

			editor = {
				selection: {
					focus: {
						path: [0, 0],
						offset: 0
					}
				},
				children: []
			}

			Excerpt.plugins.onKeyDown([mockEntry, [0]], editor, event)
			expect(event.preventDefault).toHaveBeenCalledTimes(1)
		})
	})

	describe('normalizeNode', () => {
		const editor = { type: 'mockEditor' }

		const wrapNodesSpy = Transforms.wrapNodes.mockReturnValue()
		const removeNodesSpy = Transforms.removeNodes.mockReturnValue()
		const insertNodesSpy = Transforms.insertNodes.mockReturnValue()

		Element.isElement.mockReturnValue(true)

		afterEach(() => {
			jest.clearAllMocks()
		})

		test('wraps loose text nodes in excerpt content', () => {
			const childPath = [0]
			const child = { type: 'child node' }

			Node.children.mockReturnValue([[child, childPath]])

			Text.isText.mockReturnValue(true)

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE,
						subtype: EXCERPT_CONTENT
					},
					[0]
				],
				editor,
				jest.fn()
			)

			expect(wrapNodesSpy).toHaveBeenCalled()
			expect(wrapNodesSpy).toHaveBeenCalledWith(
				editor,
				{
					type: 'ObojoboDraft.Chunks.Text',
					subtype: 'ObojoboDraft.Chunks.Text.TextLine',
					content: { indent: 0 }
				},
				{ at: childPath }
			)
		})

		test('does not wrap loose node if not a text node', () => {
			const childPath = [0]
			const child = { type: 'child node' }

			Node.children.mockReturnValue([[child, childPath]])

			Text.isText.mockReturnValue(false)

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE,
						subtype: EXCERPT_CONTENT
					},
					[0]
				],
				editor,
				jest.fn()
			)

			expect(wrapNodesSpy).not.toHaveBeenCalled()
		})

		test('removes children if more than 1 excerpt content or cite text node', () => {
			const excerptChildren = [
				[{ subtype: EXCERPT_CONTENT }, [0]],
				[{ subtype: EXCERPT_CONTENT }, [1]]
			]

			const citationTextChildren = [
				[{ subtype: CITE_TEXT_NODE }, [2]],
				[{ subtype: CITE_TEXT_NODE }, [3]]
			]

			Node.children.mockReturnValue([
				excerptChildren[0],
				excerptChildren[1],
				citationTextChildren[0],
				citationTextChildren[1],
				[{ subtype: 'OtherType' }, [4]]
			])

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE
					},
					[0]
				],
				editor,
				jest.fn()
			)

			expect(removeNodesSpy).toHaveBeenCalledTimes(3)
		})

		test('removes non-text children from citation text node', () => {
			Node.children.mockReturnValue([
				[{ text: 'citation text' }, [0]],
				[{ subtype: 'OtherType' }, [1]],
				[{ subtype: 'OtherType' }, [2]]
			])

			Text.isText
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(false)

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE,
						subtype: CITE_TEXT_NODE
					},
					[0]
				],
				editor,
				jest.fn()
			)

			expect(removeNodesSpy).toHaveBeenCalledTimes(2)
		})

		test('adds content node if one does not exist', () => {
			Node.children.mockReturnValue([])

			const path = [0]

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE
					},
					path
				],
				editor,
				jest.fn()
			)

			expect(removeNodesSpy).toHaveBeenCalledTimes(0)

			expect(insertNodesSpy).toHaveBeenCalledTimes(1)
			expect(insertNodesSpy).toHaveBeenCalledWith(
				editor,
				{ ...emptyNode.children[0] },
				{ at: path.concat(0) }
			)
		})

		test('adds citation text node if one does not exist', () => {
			Node.children.mockReturnValue([[{ subtype: EXCERPT_CONTENT }, [3]]])

			const path = [0]

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE
					},
					path
				],
				editor,
				jest.fn()
			)

			expect(removeNodesSpy).toHaveBeenCalledTimes(0)

			expect(insertNodesSpy).toHaveBeenCalledTimes(1)
			expect(insertNodesSpy).toHaveBeenCalledWith(
				editor,
				{ ...emptyNode.children[1] },
				{ at: path.concat(1) }
			)
		})

		test('makes no changes if not necessary', () => {
			const excerptChild = [{ subtype: EXCERPT_CONTENT }, [0]]

			const citationTextChild = [{ subtype: CITE_TEXT_NODE }, [2]]

			Node.children.mockReturnValue([excerptChild, citationTextChild])

			Excerpt.plugins.normalizeNode(
				[
					{
						type: EXCERPT_NODE
					},
					[0]
				],
				editor,
				jest.fn()
			)

			expect(insertNodesSpy).not.toHaveBeenCalled()
			expect(removeNodesSpy).not.toHaveBeenCalled()
			expect(wrapNodesSpy).not.toHaveBeenCalled()
		})
	})
})
