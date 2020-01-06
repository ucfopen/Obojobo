import Break from './editor-registration'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('Break editor', () => {
	test('plugins.renderNode renders a break when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: BREAK_NODE,
				data: {
					get: () => ({})
				}
			}
		}

		expect(Break.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => ({})
				}
			}
		}

		const next = jest.fn()

		expect(Break.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('plugins.onBeforeInput calls next for non-break nodes', () => {
		const next = jest.fn()
		const event = {
			preventDefault: jest.fn()
		}
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'not-break-node' })
				}
			}
		}

		Break.plugins.onBeforeInput(event, editor, next)
		expect(next).toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onBeforeInput calls prevent default for break nodes', () => {
		const next = jest.fn()
		const event = {
			preventDefault: jest.fn()
		}
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: BREAK_NODE })
				}
			}
		}

		Break.plugins.onBeforeInput(event, editor, next)
		expect(next).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onPaste calls next for non-break nodes', () => {
		const next = jest.fn()
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'not-break-node' })
				}
			},
			undo: jest.fn()
		}

		Break.plugins.onPaste(null, editor, next)
		expect(next).toHaveBeenCalled()
		expect(editor.undo).not.toHaveBeenCalled()
	})

	test('plugins.onPaste calls next for non-break nodes', () => {
		const next = jest.fn()
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: BREAK_NODE })
				}
			},
			undo: jest.fn()
		}

		Break.plugins.onPaste(null, editor, next)
		expect(next).toHaveBeenCalled()
		expect(editor.undo).toHaveBeenCalled()
	})
})
