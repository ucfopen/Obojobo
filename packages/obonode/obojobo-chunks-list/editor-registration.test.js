jest.mock('slate-react')
import { Editor, Transforms, Element, Node } from 'slate'
jest.mock('slate')
import unwrapLevel from './changes/unwrap-level'
jest.mock('./changes/unwrap-level')
import wrapLevel from './changes/wrap-level'
jest.mock('./changes/wrap-level')
import onBackspace from './changes/on-backspace'
jest.mock('./changes/on-backspace')

import List from './editor-registration'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('List editor', () => {
	test('insertData calls next if pasting a Slate fragment', () => {
		const data = {
			types: ['application/x-slate-fragment']
		}
		const next = jest.fn()

		List.plugins.insertData(data, {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('insertData calls next if not pasting into List', () => {
		const data = {
			types: ['application/html']
		}
		const next = jest.fn()
		Editor.nodes.mockImplementation((editor, { match }) => {
			match({ type: 'nonListNode' })
			return [[{ type: 'nonListNode' }]]
		})

		List.plugins.insertData(data, {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('insertData inserts all lines as ListLines if pasting into List', () => {
		const data = {
			types: ['application/html'],
			getData: () => 'line1 \n line2'
		}
		const next = jest.fn()
		Editor.nodes.mockReturnValueOnce([[{ type: LIST_NODE }]])

		List.plugins.insertData(data, {}, next)

		expect(Transforms.insertFragment).toHaveBeenCalledWith({}, [
			{
				type: LIST_NODE,
				subtype: LIST_LINE_NODE,
				content: {},
				children: [{ text: 'line1 ' }]
			},
			{
				type: LIST_NODE,
				subtype: LIST_LINE_NODE,
				content: {},
				children: [{ text: ' line2' }]
			}
		])
	})

	test('plugins.renderNode renders code when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: LIST_NODE,
				content: {}
			}
		}

		expect(List.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a level when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: LIST_NODE,
				subtype: LIST_LEVEL_NODE,
				content: {}
			}
		}

		expect(List.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.renderNode renders a line when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: LIST_NODE,
				subtype: LIST_LINE_NODE,
				content: {}
			}
		}

		expect(List.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.decorate exits when not relevent', () => {
		expect(
			List.plugins.decorate(
				[{ text: 'mock text' }],
				{}
			)
		).toMatchSnapshot()

		expect(
			List.plugins.decorate(
				[{ children: [{ text: 'mock text' }] }],
				{}
			)
		).toMatchSnapshot()
	})

	test('plugins.decorate renders a placeholder', () => {
		const editor = {
			children: [{ children: [{ text: '' }] }]
		}
		Element.isElement.mockReturnValue(true)
		Node.string.mockReturnValue('')

		expect(
			List.plugins.decorate(
				[ { children: [{ text: '' }] }, [0]],
				editor
			)
		).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no special key', () => {
		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown({}, {}, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Backspace] or [Delete]', () => {
		const event1 = {
			key: 'Backspace',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown({}, {}, event1)

		const event2 = {
			key: 'Delete',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown({}, {}, event2)
		expect(onBackspace).toHaveBeenCalledTimes(2)
	})

	test('plugins.onKeyDown deals with [Shift]+[Tab]', () => {
		const event = {
			key: 'Tab',
			shiftKey: true,
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown({}, {}, event)

		expect(unwrapLevel).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		List.plugins.onKeyDown({}, {}, event)

		expect(wrapLevel).toHaveBeenCalled()
	})
})
