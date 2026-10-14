import { freezeEditor, unfreezeEditor } from './freeze-unfreeze-editor'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'

jest.mock('slate')
jest.mock('slate-react')

describe('Freeze & Unfreeze Editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.useFakeTimers()
		jest.clearAllTimers()
	})

	test('freeze to disable the editor', () => {
		const editor = {
			toggleEditable: jest.fn()
		}

		freezeEditor(editor)
		expect(editor.toggleEditable).toHaveBeenLastCalledWith(false)
	})

	test('unfreeze to enable the editor', () => {
		const editor = {
			toggleEditable: jest.fn()
		}

		unfreezeEditor(editor)
		expect(editor.toggleEditable).toHaveBeenLastCalledWith(true)
	})

	test('unfreeze to reselect and focus the editor', () => {
		const editor = {
			toggleEditable: jest.fn(),
			prevSelection: 'mock-prev-selection'
		}

		unfreezeEditor(editor)

		expect(ReactEditor.focus).not.toHaveBeenCalled()
		expect(Transforms.select).not.toHaveBeenCalled()

		jest.runAllTimers()

		expect(ReactEditor.focus).toHaveBeenLastCalledWith(editor)
		expect(Transforms.select).toHaveBeenLastCalledWith(editor, 'mock-prev-selection')
	})
})
