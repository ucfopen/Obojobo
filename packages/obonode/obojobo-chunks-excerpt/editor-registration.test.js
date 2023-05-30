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
const EXCERPT_TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.ExcerptLine'
const EXCERPT_CONTENT = 'ObojoboDraft.Chunks.Excerpt.ExcerptContent'
const CITE_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationText'
const CITE_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationLine'

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

		test('inserts all lines as ExcerptTextLines if pasting into Code', () => {
			const data = {
				types: ['application/html'],
				getData: () => 'line1 \n line2'
			}
			const next = jest.fn()
			Editor.nodes.mockReturnValueOnce([[{ type: EXCERPT_NODE }]])

			Excerpt.plugins.insertData(data, {}, next)

			expect(Transforms.insertFragment).toHaveBeenCalledWith({}, [
				{
					type: EXCERPT_NODE,
					subtype: EXCERPT_TEXT_LINE_NODE,
					content: { indent: 0, hangingIndent: false },
					children: [{ text: 'line1 ' }]
				},
				{
					type: EXCERPT_NODE,
					subtype: EXCERPT_TEXT_LINE_NODE,
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

		test('renders excerpt citation line when passed', () => {
			const props = {
				attributes: { dummy: 'dummyData' },
				element: {
					type: EXCERPT_NODE,
					subtype: CITE_LINE_NODE,
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
					content: {}
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

		test('renders a placeholder for excerpt', () => {
			const editor = {
				children: [{ children: [{ text: '' }] }]
			}

			const node = {
				subtype: EXCERPT_TEXT_LINE_NODE,
				children: [{ text: '' }]
			}

			const point = { key: 'pointKey' }

			Element.isElement.mockReturnValue(true)
			Node.string.mockReturnValue('')
			Editor.start.mockReturnValue(point)

			const actualPlaceholders = Excerpt.plugins.decorate([node, [0]], editor)

			expect(actualPlaceholders).toEqual([
				{
					placeholder: 'Type your excerpt here',
					anchor: point,
					focus: point
				}
			])
		})

		test('renders a placeholder for excerpt', () => {
			const editor = {
				children: [{ children: [{ text: '' }] }]
			}

			const node = {
				subtype: CITE_LINE_NODE,
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

			expect(KeyDownUtil.breakToText).toHaveBeenCalled()
		})

		test('deals with [Backspace]', () => {
			const event = {
				key: 'Backspace',
				preventDefault: jest.fn()
			}

			Excerpt.plugins.onKeyDown([{}, [0]], {}, event)

			expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalled()
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

		test('removes extra citation line nodes', () => {
			const childPaths = [[0], [1], [2]]
			const children = [{ subtype: CITE_LINE_NODE }, { subtype: CITE_LINE_NODE }, { subtype: '' }]

			Node.children.mockReturnValue([
				[children[0], childPaths[0]],
				[children[1], childPaths[1]],
				[children[2], childPaths[2]]
			])

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

			expect(removeNodesSpy).not.toHaveBeenCalledWith(editor, { at: childPaths[0] })
			expect(removeNodesSpy).toHaveBeenCalledWith(editor, { at: childPaths[1] })
			expect(removeNodesSpy).toHaveBeenCalledWith(editor, { at: childPaths[2] })
		})

		test('does not remove citation line node if there is only one', () => {
			const childPaths = [[0]]
			const children = [{ subtype: CITE_LINE_NODE }]

			Node.children.mockReturnValue([[children[0], childPaths[0]]])

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

			expect(removeNodesSpy).not.toHaveBeenCalled()
		})

		test('adds an empty citation line node if there are not any', () => {
			Node.children.mockReturnValue([])

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

			expect(insertNodesSpy).toHaveBeenCalled()

			expect(insertNodesSpy).toHaveBeenCalledWith(
				editor,
				[
					{
						type: EXCERPT_NODE,
						subtype: CITE_LINE_NODE,
						content: { indent: 0, hangingIndent: 0, align: 'center' },
						children: [{ text: '' }]
					}
				],
				{ at: [0] }
			)
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
