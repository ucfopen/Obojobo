import enableWindowCloseDispatcher from '../../../src/scripts/common/util/close-window-dispatcher'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn()
}))

describe('Close Window Dispatcher', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.spyOn(window, 'addEventListener')
	})

	test('enableWindowCloseDispatcher registers listeners', () => {
		// setup
		expect(window.addEventListener).toHaveBeenCalledTimes(0)

		// execute
		enableWindowCloseDispatcher()

		// verify
		expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
	})

	test('onBeforeWindowClose dispatches closeAttempt and closeNow', () => {
		// setup
		enableWindowCloseDispatcher()
		const onBeforeWindowClose = window.addEventListener.mock.calls[0][1]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		onBeforeWindowClose(event)

		// verify
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:closeNow')
		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(event).not.toHaveProperty('returnValue')
	})

	test('onBeforeWindowClose delays closing when preventClose is called', () => {
		// setup
		enableWindowCloseDispatcher()
		const onBeforeWindowClose = window.addEventListener.mock.calls[0][1]
		const event = {
			preventDefault: jest.fn()
		}

		// call preventClose right away
		Dispatcher.trigger.mockImplementationOnce((event, preventCloseFn) => {
			preventCloseFn()
		})

		// execute
		onBeforeWindowClose(event)

		// verify
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).not.toHaveBeenCalledWith('window:closeNow')
		expect(event.preventDefault).toHaveBeenCalled()
		expect(event).toHaveProperty('returnValue', '')
	})
})
