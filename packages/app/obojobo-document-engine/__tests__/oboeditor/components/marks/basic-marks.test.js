import BasicMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/basic-marks'

const BOLD_MARK = 'b'
const ITALIC_MARK = 'i'
const STRIKE_MARK = 'del'
const QUOTE_MARK = 'q'
const MONOSPACE_MARK = 'monospace'
const LATEX_MARK = '_latex'

describe('BasicMarks', () => {
	test('onKeyDown does not toggle mark if wrong key is pressed', () => {
		const editor = {
			toggleMark: jest.fn()
		}

		BasicMarks.plugins.onKeyDown({ key: 'q' }, editor, jest.fn())

		expect(editor.toggleMark).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const editor = {
			toggleMark: jest.fn()
		}

		BasicMarks.plugins.onKeyDown({ ctrlKey: true, key: 'f' }, editor, jest.fn())

		expect(editor.toggleMark).not.toHaveBeenCalled()
	})

	test('onKeyDown toggles marks if CTRL/CMD + key is pressed', () => {
		const editor = {
			toggleMark: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			key: 'b',
			preventDefault: jest.fn()
		}

		BasicMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleMark).toHaveBeenCalledWith(BOLD_MARK)

		mockEvent.key = 'i'
		BasicMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleMark).toHaveBeenCalledWith(ITALIC_MARK)

		mockEvent.key = 'd'
		BasicMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleMark).toHaveBeenCalledWith(STRIKE_MARK)

		mockEvent.key = "'"
		BasicMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleMark).toHaveBeenCalledWith(QUOTE_MARK)

		mockEvent.key = 'm'
		BasicMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleMark).toHaveBeenCalledWith(MONOSPACE_MARK)

		mockEvent.key = 'q'
		BasicMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleMark).toHaveBeenCalledWith(LATEX_MARK)
	})

	test('renderMark diplays expected style', () => {
		expect(
			BasicMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: BOLD_MARK }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			BasicMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: ITALIC_MARK }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			BasicMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: STRIKE_MARK }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			BasicMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: QUOTE_MARK }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			BasicMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: MONOSPACE_MARK }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			BasicMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: LATEX_MARK }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('renderMark calls next', () => {
		const next = jest.fn()

		BasicMarks.plugins.renderMark(
			{
				children: 'mockChild',
				mark: { type: 'mockMark' }
			},
			null,
			next
		)

		expect(next).toHaveBeenCalled()
	})

	test('the action in each mark calls editor.toggleMark', () => {
		const editor = {
			focus: jest.fn()
		}
		editor.toggleMark = jest.fn().mockReturnValue(editor)

		BasicMarks.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(editor.toggleMark).toHaveBeenCalledTimes(6)
	})
})
