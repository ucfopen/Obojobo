import markHotKey from '../../../../src/scripts/oboeditor/components/marks/link-mark'

describe('LinkMark', () => {
	test.skip('LinkMark registers a type and key', () => {
		const keyDown = markHotKey({ type: 'a', key: 'k', render: () => 'a' })

		const mockChange = {
			toggleMark: jest.fn()
		}

		keyDown.onKeyDown({}, mockChange)
		expect(keyDown.renderMark({ mark: { type: 'a' } })).toMatchSnapshot()
		expect(keyDown.renderMark({ mark: { type: 'fake' } })).toMatchSnapshot()

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})

	test.skip('LinkMark does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const keyDown = markHotKey({ type: 'a', key: 'k' })

		const mockChange = {
			toggleMark: jest.fn()
		}
		keyDown.onKeyDown({ key: 'R' }, mockChange)

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})

	test.skip('LinkMark does toggles mark on if CTRL/CMD + key is pressed', () => {
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

		keyDown.onKeyDown(mockEvent, mockChange)

		expect(mockChange.toggleMark).toHaveBeenCalled()
	})

	test.skip('LinkMark does toggles mark off if CTRL/CMD + key is pressed', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const keyDown = markHotKey({ type: 'a', key: 'k' })

		const mockChange = {
			toggleMark: jest.fn(),
			removeMark: jest.fn(),
			value: {
				marks: {
					forEach: funct => {
						funct({
							type: 'a',
							data: { toJSON: () => 'mockJSON' }
						})

						funct({
							type: 'fake',
							data: { toJSON: () => 'mockJSON' }
						})
					}
				}
			}
		}
		const mockEvent = {
			ctrlKey: true,
			key: 'k',
			preventDefault: jest.fn()
		}

		keyDown.onKeyDown(mockEvent, mockChange)

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})
})
