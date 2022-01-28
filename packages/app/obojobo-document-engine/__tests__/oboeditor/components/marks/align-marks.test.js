import { Transforms } from 'slate'
jest.mock('slate-react')

import AlignMarks from '../../../../src/scripts/oboeditor/components/marks/align-marks'

const ALIGN_RIGHT = 'right'
const ALIGN_CENTER = 'center'
const ALIGN_LEFT = 'left'
const ALIGN_JUSTIFY = 'justify'

describe('AlignMarks', () => {
	test('onKeyDown does not toggle mark if wrong key is pressed', () => {
		const editor = {
			setAlign: jest.fn()
		}

		AlignMarks.plugins.onKeyDown({ key: 'q' }, editor, jest.fn())

		expect(editor.setAlign).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if shift key is pressed', () => {
		const editor = {
			setAlign: jest.fn()
		}

		AlignMarks.plugins.onKeyDown({ key: 'q', shiftKey: true }, editor, jest.fn())

		expect(editor.setAlign).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const editor = {
			setAlign: jest.fn()
		}

		AlignMarks.plugins.onKeyDown({ ctrlKey: true, key: 'q' }, editor, jest.fn())

		expect(editor.setAlign).not.toHaveBeenCalled()
	})

	test('onKeyDown toggles Left if CTRL/CMD + Shift + L is pressed', () => {
		const mockChange = {
			setAlign: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			shiftKey: true,
			key: 'l',
			preventDefault: jest.fn()
		}

		AlignMarks.plugins.onKeyDown(mockEvent, mockChange, jest.fn())

		expect(mockChange.setAlign).toHaveBeenCalledWith(ALIGN_LEFT)
	})

	test('onKeyDown toggles Right if CTRL/CMD + Shift + R is pressed', () => {
		const mockChange = {
			setAlign: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			shiftKey: true,
			key: 'r',
			preventDefault: jest.fn()
		}

		AlignMarks.plugins.onKeyDown(mockEvent, mockChange, jest.fn())

		expect(mockChange.setAlign).toHaveBeenCalledWith(ALIGN_RIGHT)
	})

	test('onKeyDown toggles Center if CTRL/CMD + Shift + E is pressed', () => {
		const mockChange = {
			setAlign: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			shiftKey: true,
			key: 'e',
			preventDefault: jest.fn()
		}

		AlignMarks.plugins.onKeyDown(mockEvent, mockChange, jest.fn())

		expect(mockChange.setAlign).toHaveBeenCalledWith(ALIGN_CENTER)
	})

	test('onKeyDown toggles Center if CTRL/CMD + Shift + J is pressed', () => {
		const mockChange = {
			setAlign: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			shiftKey: true,
			key: 'j',
			preventDefault: jest.fn()
		}

		AlignMarks.plugins.onKeyDown(mockEvent, mockChange, jest.fn())

		expect(mockChange.setAlign).toHaveBeenCalledWith(ALIGN_JUSTIFY)
	})

	test('setAlign changes the alignment of Text nodes and other nodes', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const editor = {
			children: [
				{
					type: 'mockNode',
					children: [
						{
							type: 'mockChildNode',
							children: [{ text: '' }]
						}
					]
				}
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		AlignMarks.plugins.commands.setAlign(editor, ALIGN_CENTER)

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('the action in each mark calls editor.setAlign', () => {
		const editor = {
			setAlign: jest.fn()
		}

		AlignMarks.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(editor.setAlign).toHaveBeenCalledTimes(4)
	})
})
