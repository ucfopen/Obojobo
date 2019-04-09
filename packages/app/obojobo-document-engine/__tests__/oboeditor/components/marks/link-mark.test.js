import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

import markHotKey from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/link-mark'

describe('LinkMark', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('LinkMark registers a type and key', () => {
		const keyDown = markHotKey({ type: 'a', render: () => 'a' })

		const mockChange = {
			toggleMark: jest.fn()
		}

		keyDown.onKeyDown({}, mockChange, jest.fn())
		expect(keyDown.renderMark({ mark: { type: 'a' } }, null, jest.fn())).toMatchSnapshot()
		expect(keyDown.renderMark({ mark: { type: 'fake' } }, null, jest.fn())).toMatchSnapshot()

		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('LinkMark does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const keyDown = markHotKey({ type: 'a', key: 'k' })

		const mockChange = {
			toggleMark: jest.fn()
		}
		keyDown.onKeyDown({ key: 'R' }, mockChange, jest.fn())

		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('LinkMark does toggles mark on if CTRL/CMD + key is pressed', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const keyDown = markHotKey({ type: 'a', key: 'k' })

		const mockChange = {
			toggleMark: jest.fn(),
			removeMark: jest.fn(),
			value: {
				marks: [
					{
						type: 'b'
					}
				]
			}
		}
		const mockEvent = {
			ctrlKey: true,
			key: 'k',
			preventDefault: jest.fn()
		}

		keyDown.onKeyDown(mockEvent, mockChange, jest.fn())

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeLinkValue does not add link', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const keyDown = markHotKey({ type: 'a', key: 'k' })

		const editor = {
			toggleMark: jest.fn(),
			removeMark: jest.fn(),
			addMark: jest.fn(),
			value: {
				marks: [
					{
						type: 'a',
						data: {
							toJSON: jest.fn()
						}
					},
					{
						type: 'b'
					}
				]
			}
		}

		keyDown.helpers.changeLinkValue(editor, '   ')

		expect(editor.addMark).not.toHaveBeenCalled()
	})

	test('changeLinkValue adds link', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const keyDown = markHotKey({ type: 'a', key: 'k' })

		const editor = {
			toggleMark: jest.fn(),
			removeMark: jest.fn(),
			addMark: jest.fn(),
			value: {
				marks: [
					{
						type: 'a',
						data: {
							toJSON: jest.fn()
						}
					},
					{
						type: 'b'
					}
				]
			}
		}

		keyDown.helpers.changeLinkValue(editor, 'mockLink')

		expect(editor.addMark).toHaveBeenCalled()
	})
})
