import { Editor } from 'slate'
jest.mock('slate-react')

import ScriptMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/script-marks'

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

	test('renderLeaf diplays expected style', () => {
		expect(
			ScriptMarks.plugins.renderLeaf({
				leaf: {
					sup: true,
					num: 1
				},
				children: 'mockChild',
			})
		).toMatchSnapshot()

		expect(
			ScriptMarks.plugins.renderLeaf({
				leaf: {
					sup: true,
					num: -1
				},
				children: 'mockChild'
			})
		).toMatchSnapshot()
	})

	test('renderLeaf does nothing', () => {
		expect(ScriptMarks.plugins.renderLeaf({
			leaf: {},
			children: 'mockChild'
		})).toMatchSnapshot()
	})

	test('toggleScript removes marks', () => {
		jest.spyOn(Editor, 'removeMark').mockReturnValue(true)

		const editor = {
			children: [
				{ text: 'mockText', sup: true, num: 1 }
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		ScriptMarks.plugins.commands.toggleScript(editor, 1)

		expect(Editor.removeMark).toHaveBeenCalled()
	})

	test('toggleScript adds marks', () => {
		jest.spyOn(Editor, 'addMark').mockReturnValue(true)

		const editor = {
			children: [
				{ text: 'mockText', sup: true, num: -1 }
			],
			selection: {
				anchor: { path: [0], offset: 0 },
				focus: { path: [0], offset: 0 }
			},
			isVoid: () => false,
			isInline: () => false
		}

		ScriptMarks.plugins.commands.toggleScript(editor, 1)

		expect(Editor.addMark).toHaveBeenCalled()
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
