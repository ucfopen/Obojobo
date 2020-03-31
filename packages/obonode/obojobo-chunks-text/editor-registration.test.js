jest.mock('slate')
jest.mock('slate-react')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')
jest.mock('./changes/increase-indent')
jest.mock('./changes/indent-or-tab')
jest.mock('./changes/decrease-indent')
jest.mock('./changes/split-parent')
jest.mock('./changes/toggle-hanging-indent')

import { Editor, Transforms, Element, Node } from 'slate'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import decreaseIndent from './changes/decrease-indent'
import increaseIndent from './changes/increase-indent'
import indentOrTab from './changes/indent-or-tab'
import splitParent from './changes/split-parent'

import toggleHangingIndent from './changes/toggle-hanging-indent'
import Text from './editor-registration'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

describe('Text editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('insertData calls next if pasting a Slate fragment', () => {
		const data = {
			types: ['application/x-slate-fragment']
		}
		const next = jest.fn()

		Text.plugins.insertData(data, {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('insertData calls next if not pasting into Text', () => {
		const data = {
			types: ['application/html']
		}
		const next = jest.fn()
		Editor.nodes.mockImplementation((editor, { match }) => {
			match({ type: 'nonTextNode' })
			return [[{ type: 'nonTextNode' }]]
		})

		Text.plugins.insertData(data, {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('insertData inserts all lines as TextLines if pasting into Text', () => {
		const data = {
			types: ['application/html'],
			getData: () => 'line1 \n line2'
		}
		const next = jest.fn()
		Editor.nodes.mockReturnValueOnce([[{ type: TEXT_NODE }]])

		Text.plugins.insertData(data, {}, next)

		expect(Transforms.insertFragment).toHaveBeenCalledWith({}, [
			{
				type: TEXT_NODE,
				subtype: TEXT_LINE_NODE,
				content: { indent: 0, align: 'left' },
				children: [{ text: 'line1 ' }]
			},
			{
				type: TEXT_NODE,
				subtype: TEXT_LINE_NODE,
				content: { indent: 0, align: 'left' },
				children: [{ text: ' line2' }]
			}
		])
	})

	test('plugins.decorate exits when not relevent', () => {
		expect(Text.plugins.decorate([{ text: 'mock text' }], {})).toMatchSnapshot()

		expect(Text.plugins.decorate([{ children: [{ text: 'mock text' }] }], {})).toMatchSnapshot()
	})

	test('plugins.decorate renders a placeholder', () => {
		const editor = {
			children: [{ children: [{ text: '' }] }]
		}
		Element.isElement.mockReturnValue(true)
		Node.string.mockReturnValue('')

		expect(Text.plugins.decorate([{ children: [{ text: '' }] }, [0]], editor)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no special key', () => {
		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown([{}, [0]], {}, event)

		expect(splitParent).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete]', () => {
		const event1 = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown([{}, [0]], {}, event1)

		const event2 = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown([{}, [0]], {}, event2)
		expect(KeyDownUtil.deleteEmptyParent).toHaveBeenCalledTimes(2)
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown([{}, [0]], {}, event)

		expect(decreaseIndent).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Alt]+[Tab]', () => {
		const event = {
			key: 'Tab',
			altKey: true,
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown([{}, [0]], {}, event)

		expect(increaseIndent).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		const editor = {
			insertText: jest.fn()
		}

		Text.plugins.onKeyDown([{}, [0]], editor, event)

		expect(indentOrTab).toHaveBeenCalled()
	})

	test('plugins.onKeyDown ignores [h]', () => {
		// setup
		const event = {
			key: 'h',
			ctrlKey: false,
			preventDefault: jest.fn()
		}

		// pre-execute verification
		expect(toggleHangingIndent).not.toHaveBeenCalled()

		// execute
		Text.plugins.onKeyDown([{}, [0]], {}, event)

		// verify
		expect(toggleHangingIndent).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [ctrl]+[h]', () => {
		// setup
		const event = {
			key: 'h',
			metaKey: true,
			preventDefault: jest.fn()
		}

		// pre-execute verification
		expect(toggleHangingIndent).not.toHaveBeenCalled()

		// execute
		Text.plugins.onKeyDown([{}, [0]], {}, event)

		// verify
		expect(toggleHangingIndent).toHaveBeenCalled()
	})

	test.skip('plugins.onKeyDown deals with random keys', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey',
						data: { get: () => 0 }
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				}
			}
		}
		editor.setNodeByKey = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		Text.plugins.onKeyDown(event, editor, jest.fn())

		expect(editor.setNodeByKey).not.toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('renderNode renders text when passed', () => {
		const props = {
			element: {
				type: TEXT_NODE
			}
		}

		expect(Text.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a line when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: TEXT_NODE,
				subtype: TEXT_LINE_NODE
			}
		}

		expect(Text.plugins.renderNode(props)).toMatchSnapshot()
	})
})
