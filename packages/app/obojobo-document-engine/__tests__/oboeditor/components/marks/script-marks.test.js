import ScriptMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/script-marks'

const SCRIPT_MARK = 'sup'

describe('ScriptMarks', () => {
	test('onKeyDown does not toggle mark if wrong key is pressed', () => {
		const editor = {
			toggleScript: jest.fn()
		}

		ScriptMarks.plugins.onKeyDown({ key: 'q' }, editor, jest.fn())

		expect(editor.toggleScript).not.toHaveBeenCalled()
	})

	test('onKeyDown does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const editor = {
			toggleScript: jest.fn()
		}

		ScriptMarks.plugins.onKeyDown({ ctrlKey: true, key: 'f' }, editor, jest.fn())

		expect(editor.toggleScript).not.toHaveBeenCalled()
	})

	test('onKeyDown toggles marks if CTRL/CMD + key is pressed', () => {
		const editor = {
			toggleScript: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			key: '-',
			preventDefault: jest.fn()
		}

		ScriptMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleScript).toHaveBeenCalledWith(-1)

		mockEvent.key = ','
		ScriptMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleScript).toHaveBeenCalledWith(-1)

		mockEvent.key = '='
		ScriptMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleScript).toHaveBeenCalledWith(1)

		mockEvent.key = '.'
		ScriptMarks.plugins.onKeyDown(mockEvent, editor, jest.fn())
		expect(editor.toggleScript).toHaveBeenCalledWith(1)
	})

	test('renderMark diplays expected style', () => {
		expect(
			ScriptMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: SCRIPT_MARK, data: { get: () => 1 } }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()

		expect(
			ScriptMarks.plugins.renderMark(
				{
					children: 'mockChild',
					mark: { type: SCRIPT_MARK, data: { get: () => -1 } }
				},
				null,
				jest.fn()
			)
		).toMatchSnapshot()
	})

	test('renderMark calls next', () => {
		const next = jest.fn()

		ScriptMarks.plugins.renderMark(
			{
				children: 'mockChild',
				mark: { type: 'mockMark' }
			},
			null,
			next
		)

		expect(next).toHaveBeenCalled()
	})

	test('toggleScript removes marks', () => {
		const editor = {
			removeMark: jest.fn(),
			addMark: jest.fn(),
			value: {
				marks: [{ type: SCRIPT_MARK, data: { get: () => 1 } }]
			}
		}

		ScriptMarks.plugins.queries.toggleScript(editor, 1)

		expect(editor.removeMark).toHaveBeenCalled()
		expect(editor.addMark).not.toHaveBeenCalled()
	})

	test('toggleScript removes marks', () => {
		const editor = {
			removeMark: jest.fn(),
			addMark: jest.fn(),
			value: {
				marks: [{ type: 'mockMark', data: { get: () => 1 } }]
			}
		}

		ScriptMarks.plugins.queries.toggleScript(editor, 1)

		expect(editor.removeMark).not.toHaveBeenCalled()
		expect(editor.addMark).toHaveBeenCalled()
	})

	test('the action in each mark calls editor.toggleScript', () => {
		const editor = {
			toggleScript: jest.fn()
		}

		ScriptMarks.marks.forEach(mark => {
			mark.action(editor)
		})

		expect(editor.toggleScript).toHaveBeenCalledTimes(2)
	})
})
