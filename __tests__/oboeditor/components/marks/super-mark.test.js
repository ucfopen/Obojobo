import markHotKey from '../../../../src/scripts/oboeditor/components/marks/super-mark'

describe('SuperMark', () => {
	test('SuperMark registers a type and key', () => {
		const keyDown = markHotKey({ type: 'sup', key: '.', render: () => 'a' })

		const mockChange = {
			toggleMark: jest.fn()
		}

		keyDown.onKeyDown({}, mockChange)
		expect(keyDown.renderMark({ mark: { type: 'sup' } })).toMatchSnapshot()
		expect(keyDown.renderMark({ mark: { type: 'fake' } })).toMatchSnapshot()

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})

	test('SuperMark does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const keyDown = markHotKey({ type: 'sup', key: ',', modifier: -1 })

		const mockChange = {
			toggleMark: jest.fn()
		}
		keyDown.onKeyDown({ key: 'R' }, mockChange)

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})

	test('SuperMark does toggles mark if CTRL/CMD + key is pressed', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const keyDown = markHotKey({ type: 'a', key: '.', modifier: 1 })

		const mockChange = {
			removeMark: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return (
							funct({
								type: 'fake',
								data: { get: () => 1 }
							}) ||
							funct({
								type: 'sup',
								data: { get: () => 1 }
							})
						)
					}
				}
			}
		}
		const mockEvent = {
			ctrlKey: true,
			key: '.',
			preventDefault: jest.fn()
		}

		keyDown.onKeyDown(mockEvent, mockChange)

		expect(mockChange.removeMark).toHaveBeenCalled()
	})

	test('SuperMark does toggles mark if CTRL/CMD + key is pressed', () => {
		window.prompt = jest.fn().mockReturnValueOnce(null)
		const keyDown = markHotKey({ type: 'a', key: ',', modifier: -1 })

		const mockChange = {
			addMark: jest.fn(),
			value: {
				marks: {
					some: funct => {
						return funct({
							type: 'fake',
							data: { get: () => -1 }
						})
					}
				}
			}
		}
		const mockEvent = {
			ctrlKey: true,
			key: ',',
			preventDefault: jest.fn()
		}

		keyDown.onKeyDown(mockEvent, mockChange)

		expect(mockChange.addMark).toHaveBeenCalled()
	})
})
