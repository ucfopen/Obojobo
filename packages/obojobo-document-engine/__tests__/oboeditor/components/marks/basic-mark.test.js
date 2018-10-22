import markHotKey from '../../../../src/scripts/oboeditor/components/marks/basic-mark'

describe('HotKey', () => {
	test('HotKey registers a type and key', () => {
		const keyDown = markHotKey({type: 'bold', key: 'B', render: () => 'a'})

		const mockChange = {
			toggleMark: jest.fn()
		}

		keyDown.onKeyDown({}, mockChange)
		expect(keyDown.renderMark({ mark: {type: 'bold'} })).toMatchSnapshot()
		expect(keyDown.renderMark({ mark: {type: 'fake'} })).toMatchSnapshot()

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})

	test('HotKey does not toggle mark if CTRL/CMD + wrong key is pressed', () => {
		const keyDown = markHotKey({ type: 'bold', key: 'B' })

		const mockChange = {
			toggleMark: jest.fn()
		}

		keyDown.onKeyDown({ key: 'R' }, mockChange)

		expect(mockChange.toggleMark).not.toHaveBeenCalled()
	})

	test('HotKey does toggles mark if CTRL/CMD + key is pressed', () => {
		const keyDown = markHotKey({ type: 'bold', key: 'B' })

		const mockChange = {
			toggleMark: jest.fn()
		}
		const mockEvent = {
			ctrlKey: true,
			key: 'B',
			preventDefault: jest.fn()
		}

		keyDown.onKeyDown(mockEvent, mockChange)

		expect(mockChange.toggleMark).toHaveBeenCalledWith('bold')
	})
})
