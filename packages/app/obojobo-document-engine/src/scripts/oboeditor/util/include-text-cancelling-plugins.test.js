import includeTextCancellingPlugins from './include-text-cancelling-plugins'

describe('includeTextCancellingPlugins', () => {
	beforeAll(() => {})

	test('includeTextCancellingPlugins adds two methods to given config', () => {
		const plugins = {}

		includeTextCancellingPlugins(null, plugins)

		expect(Object.keys(plugins)).toEqual(['onBeforeInput', 'onPaste'])
	})

	test('plugins.onBeforeInput calls next for non-target nodes', () => {
		const next = jest.fn()
		const event = {
			preventDefault: jest.fn()
		}
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'not-target-node' })
				}
			}
		}

		const plugins = includeTextCancellingPlugins('target-node', {})

		plugins.onBeforeInput(event, editor, next)
		expect(next).toHaveBeenCalled()
		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onBeforeInput calls prevent default for target nodes', () => {
		const next = jest.fn()
		const event = {
			preventDefault: jest.fn()
		}
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'target-node' })
				}
			}
		}

		const plugins = includeTextCancellingPlugins('target-node', {})

		plugins.onBeforeInput(event, editor, next)
		expect(next).toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalled()
	})

	test('plugins.onPaste calls next for non-target nodes', () => {
		const next = jest.fn()
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'not-target-node' })
				}
			}
		}

		const plugins = includeTextCancellingPlugins('target-node', {})

		plugins.onPaste(null, editor, next)
		expect(next).toHaveBeenCalled()
	})

	test('plugins.onPaste does not call next for target nodes', () => {
		const next = jest.fn()
		const editor = {
			value: {
				blocks: {
					some: fn => fn({ type: 'target-node' })
				}
			}
		}

		const plugins = includeTextCancellingPlugins('target-node', {})

		plugins.onPaste(null, editor, next)
		expect(next).not.toHaveBeenCalled()
	})
})
