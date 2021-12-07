import Figure from './editor-registration'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import { Transforms, Editor, Node, Element } from 'slate'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
jest.mock('slate-react')
jest.mock('slate')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

describe('Figure editor', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.clearAllMocks()
	})

	test('plugins.normalizeNode calls next if the node is not an Figure', () => {
		const figure = {
			type: 'not a figure',
			children: [{ text: '' }]
		}
		const editor = { isInline: () => true }
		const next = jest.fn()
		Element.isElement.mockReturnValue(true)

		const entry = [figure, [0]]
		Figure.plugins.normalizeNode(entry, editor, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls next if all Figure children are text', () => {
		const figure = {
			type: FIGURE_NODE,
			children: [{ text: '' }]
		}
		const editor = { isInline: () => true }
		const next = jest.fn()
		Element.isElement.mockReturnValue(true)
		Node.children.mockReturnValue(['mock-child', 'mock-path'])

		const entry = [figure, [0]]
		Figure.plugins.normalizeNode(entry, editor, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms on an invalid child', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const figure = {
			type: FIGURE_NODE,
			children: [{ type: 'mockElement' }]
		}
		const editor = { isInline: () => false }
		const next = jest.fn()

		Element.isElement.mockReturnValue(true)
		Node.children.mockReturnValue(['mock-child', 'mock-path'])

		const entry = [figure, [0]]
		Figure.plugins.normalizeNode(entry, editor, next)
		expect(Transforms.liftNodes).toHaveBeenCalled()
		expect(next).not.toHaveBeenCalled()
	})

	test('plugins.decorate exits when not relevant', () => {
		expect(Figure.plugins.decorate([{ text: 'mock text' }], {})).toMatchSnapshot()

		expect(Figure.plugins.decorate([{ children: [{ text: 'mock text' }] }], {})).toMatchSnapshot()
	})

	test('plugins.decorate renders a placeholder', () => {
		const editor = {
			children: [{ children: [{ text: '' }] }]
		}

		const node = { children: [{ text: '' }] }
		const path = [0]
		Element.isElement.mockReturnValueOnce(true)
		Node.string.mockReturnValueOnce('')
		Editor.start.mockReturnValueOnce('mock-point')
		expect(Figure.plugins.decorate([node, path], editor)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no special key', () => {
		const event = {
			key: 'k',
			preventDefault: jest.fn()
		}

		Figure.plugins.onKeyDown([{}, [0]], {}, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		jest.spyOn(Transforms, 'insertText').mockReturnValueOnce(true)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Figure.plugins.onKeyDown([{}, [0]], {}, event)
		expect(KeyDownUtil.breakToText).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Delete]', () => {
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

		Figure.plugins.onKeyDown([{ children: [{ text: 'mockText' }] }, [0]], editor, event)
		expect(event.preventDefault).not.toHaveBeenCalled()

		Figure.plugins.onKeyDown([{ children: [{ text: '' }] }, [0]], editor, event)
		expect(event.preventDefault).toHaveBeenCalledTimes(1)
	})

	test('plugins.renderNode renders a figure when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: FIGURE_NODE,
				content: {}
			}
		}

		expect(Figure.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.insertItemInto inserts a clone and cleans up dupilcate Figure', () => {
		const editor = {
			path: jest.fn(),
			children: []
		}
		const item = {
			name: 'mock',
			cloneBlankNode: () => 'mock-clone'
		}
		// add an extra node when the clone is created
		// so that insertItemInto will believe a single node was added
		Transforms.insertNodes.mockImplementationOnce(() => {
			editor.children.push('extra node', 'duplicate-figure')
		})
		const mockPath = [0, 0, 0]

		Editor.path.mockReturnValue(mockPath)

		Figure.plugins.insertItemInto(editor, item)
		expect(Transforms.insertNodes).toHaveBeenCalledWith(editor, 'mock-clone')
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('plugins.insertItemInto inserts a clone and skips cleanup', () => {
		const editor = {
			path: jest.fn(),
			children: []
		}
		const item = {
			name: 'mock',
			cloneBlankNode: () => 'mock-clone'
		}
		// add an extra node when the clone is created
		// so that insertItemInto will believe a single node was added
		Transforms.insertNodes.mockImplementationOnce(() => {
			editor.children.push('extra node')
		})

		const mockPath = [0, 0, 0]

		Editor.path.mockReturnValue(mockPath)

		Figure.plugins.insertItemInto(editor, item)
		expect(Transforms.insertNodes).toHaveBeenCalledWith(editor, 'mock-clone')
		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})
})
