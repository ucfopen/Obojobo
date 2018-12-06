import HTML from '../../../../ObojoboDraft/Chunks/HTML/editor'
const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

describe('HTML editor', () => {
	test('plugins.renderNode renders a button when passed', () => {
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

		expect(HTML.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.onKeyDown deals with no html', () => {
		const change = {
			value: {
				blocks: [
					{
						type: 'mockType'
					}
				]
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with random keypress', () => {
		const change = {
			value: {
				blocks: [
					{
						type: HTML_NODE
					}
				]
			}
		}
		change.insertBlock = jest.fn().mockReturnValueOnce(change)

		const event = {
			key: 'e',
			preventDefault: jest.fn()
		}

		HTML.plugins.onKeyDown(event, change)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		const change = {
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

		HTML.plugins.onKeyDown(event, change)
		expect(event.preventDefault).toHaveBeenCalled()
		expect(change.insertText).toHaveBeenCalledWith('\n')
	})

	test('plugins.onKeyDown deals with [Tab]', () => {
		const change = {
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

		HTML.plugins.onKeyDown(event, change)
		expect(event.preventDefault).toHaveBeenCalled()
		expect(change.insertText).toHaveBeenCalledWith('\t')
	})
})
