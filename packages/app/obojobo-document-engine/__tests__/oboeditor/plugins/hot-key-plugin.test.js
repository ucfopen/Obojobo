import hotKeyPlugin from 'src/scripts/oboeditor/plugins/hot-key-plugin'

describe('HotKeyPlugin', () => {
	test('onKeyPress calls next with no ctrl or meta keys', () => {
		const mockEvent = { ctrlKey: false, metaKey: false }
		const editor = {}
		const next = jest.fn()

		hotKeyPlugin(jest.fn(), jest.fn(), jest.fn()).onKeyUp(mockEvent, editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('onKeyPress calls saveFn with ctrl+s', () => {
		const mockEvent = { ctrlKey: true, key: 's', preventDefault: jest.fn() }
		const editor = {}
		const next = jest.fn()

		const save = jest.fn()
		hotKeyPlugin(save, jest.fn(), jest.fn()).onKeyUp(mockEvent, editor, next)

		expect(save).toHaveBeenCalled()
	})

	test('onKeyPress calls saveFn with ctrl+z', () => {
		const mockEvent = { ctrlKey: true, key: 'z', preventDefault: jest.fn() }
		const editor = { undo: jest.fn() }
		const next = jest.fn()

		const save = jest.fn()
		hotKeyPlugin(save, jest.fn(), jest.fn()).onKeyUp(mockEvent, editor, next)

		expect(editor.undo).toHaveBeenCalled()
	})

	test('onKeyPress calls saveFn with ctrl+y', () => {
		const mockEvent = { ctrlKey: true, key: 'y', preventDefault: jest.fn() }
		const editor = { redo: jest.fn() }
		const next = jest.fn()

		const save = jest.fn()
		hotKeyPlugin(save, jest.fn(), jest.fn()).onKeyUp(mockEvent, editor, next)

		expect(editor.redo).toHaveBeenCalled()
	})

	test('onKeyPress calls saveFn with ctrl+a', () => {
		const mockEvent = { ctrlKey: true, key: 'a', preventDefault: jest.fn() }
		const editor = { focus: jest.fn() }
		editor.moveToRangeOfDocument = jest.fn().mockReturnValue(editor)
		const next = jest.fn()

		const save = jest.fn()
		hotKeyPlugin(save, jest.fn(), jest.fn()).onKeyUp(mockEvent, editor, next)

		expect(editor.focus).toHaveBeenCalled()
	})

	test('onKeyPress calls next with ctrl+other', () => {
		const mockEvent = { ctrlKey: true, key: 'r', preventDefault: jest.fn() }
		const editor = {}
		const next = jest.fn()

		const save = jest.fn()
		hotKeyPlugin(save, jest.fn(), jest.fn()).onKeyUp(mockEvent, editor, next)

		expect(next).toHaveBeenCalled()
	})

	test('markUnsaved calls unsavedFn', () => {
		const markUnsaved = jest.fn()
		hotKeyPlugin(jest.fn(), markUnsaved, jest.fn()).commands.markUnsaved()

		expect(markUnsaved).toHaveBeenCalled()
	})

	test('toggleEditable calls unsavedFn', () => {
		const toggleEditable = jest.fn()
		hotKeyPlugin(jest.fn(), jest.fn(), toggleEditable).commands.toggleEditable({}, true)

		expect(toggleEditable).toHaveBeenCalled()
	})
})
