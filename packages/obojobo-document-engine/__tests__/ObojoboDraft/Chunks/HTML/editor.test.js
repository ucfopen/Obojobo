import HTML from '../../../../ObojoboDraft/Chunks/HTML/editor'
const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

describe('HTML editor', () => {
	test('plugins.renderNode renders HTML when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: HTML_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(HTML.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(HTML.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with no html', () => {
		const editor = {
			value: {
				blocks: [
					{
						type: 'mockType'
					}
				]
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keypress', () => {
		const editor = {
			value: {
				blocks: [
					{
						type: HTML_NODE
					}
				]
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const editor = {
			value: {
				blocks: [
					{
						type: HTML_NODE
					}
				]
			},
			insertText: jest.fn()
		}

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, editor, jest.fn())
		expect(event.preventDefault).toHaveBeenCalled()
		expect(editor.insertText).toHaveBeenCalledWith('\n')
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const editor = {
			value: {
				blocks: [
					{
						type: HTML_NODE
					}
				]
			},
			insertText: jest.fn()
		}

		const event = {
			key: 'Tab',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, editor, jest.fn())
		expect(event.preventDefault).toHaveBeenCalled()
		expect(editor.insertText).toHaveBeenCalledWith('\t')
	})
})
