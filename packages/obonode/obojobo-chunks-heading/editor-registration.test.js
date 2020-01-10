import SlateReact from 'slate-react'

import Heading from './editor-registration'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

jest.mock('slate-react')

describe('Heading editor', () => {
	test('plugins.renderNode renders Heading when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: HEADING_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Heading.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Heading.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.renderPlaceholder exits when not relevent', () => {
		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'text'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: 'mockType'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: HEADING_NODE,
						text: 'Some text'
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('plugins.renderPlaceholder renders a placeholder', () => {
		expect(
			Heading.plugins.renderPlaceholder(
				{
					node: {
						object: 'block',
						type: HEADING_NODE,
						text: '',
						data: { get: () => ({ align: 'left' }) }
					}
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('getNavItem returns expected object', () => {
		const model = {
			modelState: {
				headingLevel: 1,
				textGroup: {
					first: {
						text: 'testText'
					}
				}
			},
			getIndex: () => 0,
			showChildren: false,
			toText: () => 'test string'
		}

		expect(Heading.getNavItem(model)).toBe(null)

		model.modelState.headingLevel = 2
		expect(Heading.getNavItem(model)).toEqual({
			type: 'sub-link',
			label: 'testText',
			path: ['test-string'],
			showChildren: false
		})

		model.modelState.headingLevel = 3
		expect(Heading.getNavItem(model)).toBe(null)
	})

	test('onPaste handler calls next if item is not a heading', () => {
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'not-heading-node' })
				}
			},
			insertText: jest.fn()
		}
		const next = jest.fn()

		SlateReact.getEventTransfer.mockReturnValueOnce({ type: 'text' })

		Heading.plugins.onPaste(null, editor, next)

		expect(next).toHaveBeenCalled()
		expect(editor.insertText).not.toHaveBeenCalled()
	})

	test('onPaste handler calls next if transfer type is not text', () => {
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: HEADING_NODE })
				}
			},
			insertText: jest.fn()
		}
		const next = jest.fn()

		SlateReact.getEventTransfer.mockReturnValueOnce({ type: 'fragment' })

		Heading.plugins.onPaste(null, editor, next)

		expect(next).toHaveBeenCalled()
		expect(editor.insertText).not.toHaveBeenCalled()
	})

	test('onPaste handler calls editor.insertText if item is a heading and transfer type is text', () => {
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: HEADING_NODE })
				}
			},
			insertText: jest.fn()
		}
		const next = jest.fn()

		SlateReact.getEventTransfer.mockReturnValueOnce({ type: 'text', text: 'mock-text' })

		Heading.plugins.onPaste(null, editor, next)

		expect(next).not.toHaveBeenCalled()
		expect(editor.insertText).toHaveBeenCalledWith('mock-text')
	})
})
