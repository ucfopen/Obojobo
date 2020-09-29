import { Transforms } from 'slate'

import HTML from './editor-registration'
const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

jest.mock('slate-react')

describe('HTML editor', () => {
	test('plugins.normalizeNode calls next if the node is not an ActionButton', () => {
		const next = jest.fn()
		HTML.plugins.normalizeNode([{}, []], {}, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls next if all HTML children are text', () => {
		const button = {
			type: HTML_NODE,
			children: [{ text: '' }]
		}
		const next = jest.fn()

		HTML.plugins.normalizeNode([button, [0]], { children: [button] }, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.normalizeNode calls Transforms on an invalid child', () => {
		jest.spyOn(Transforms, 'liftNodes').mockReturnValueOnce(true)

		const button = {
			type: HTML_NODE,
			children: [
				{
					type: 'mockElement',
					children: [{ text: '' }]
				}
			]
		}
		const editor = {
			isInline: () => false,
			children: [button]
		}
		const next = jest.fn()

		HTML.plugins.normalizeNode([button, [0]], editor, next)
		expect(Transforms.liftNodes).toHaveBeenCalled()
	})

	test('plugins.decorate exits when not relevent', () => {
		expect(HTML.plugins.decorate([{ text: 'mock text' }], {})).toMatchSnapshot()

		expect(HTML.plugins.decorate([{ children: [{ text: 'mock text' }] }], {})).toMatchSnapshot()
	})

	test('plugins.decorate renders a placeholder', () => {
		const editor = {
			children: [{ children: [{ text: '' }] }]
		}

		expect(HTML.plugins.decorate([{ children: [{ text: '' }] }, [0]], editor)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no special key', () => {
		const event = {
			key: 'k',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown([{}, [0]], {}, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		jest.spyOn(Transforms, 'insertText').mockReturnValueOnce(true)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown([{}, [0]], {}, event)
		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.insertText).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		jest.spyOn(Transforms, 'insertText').mockReturnValueOnce(true)
		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown([{}, [0]], {}, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.insertText).toHaveBeenCalled()
	})

	test('plugins.renderNode renders HTML when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			element: {
				type: HTML_NODE,
				content: {}
			}
		}

		expect(HTML.plugins.renderNode(props)).toMatchSnapshot()
	})
})
