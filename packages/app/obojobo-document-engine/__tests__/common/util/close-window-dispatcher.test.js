import enableWindowCloseDispatcher from '../../../src/scripts/common/util/close-window-dispatcher'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn()
}))

describe('Close Window Dispatcher', () => {
	let visibilityState = 'visible'
	beforeEach(() => {
		jest.clearAllMocks()
		jest.spyOn(window, 'addEventListener')
		visibilityState = 'visible'
		Object.defineProperty(window, 'visibilityState', {
			configurable: true,
			get() {
				return visibilityState
			},
			set(state) {
				visibilityState = state
			}
		})
	})

	test('enableWindowCloseDispatcher registers listeners', () => {
		// setup
		expect(window.addEventListener).toHaveBeenCalledTimes(0)

		// execute
		enableWindowCloseDispatcher()

		// verify
		expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
		expect(window.addEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function))
		expect(window.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
	})

	test('visibilitychange is not listened to when not supported', () => {
		// setup
		visibilityState = false
		expect(window.addEventListener).toHaveBeenCalledTimes(0)

		// execute
		enableWindowCloseDispatcher()

		// verify
		expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
		expect(window.addEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function))
		expect(window.addEventListener).not.toHaveBeenCalledWith(
			'visibilitychange',
			expect.any(Function)
		)
	})

	test('onBeforeWindowClose dispatches closeAttempt and closeNow', () => {
		// setup
		enableWindowCloseDispatcher()
		const [eventName, onBeforeWindowClose] = window.addEventListener.mock.calls[0]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		onBeforeWindowClose(event)

		// verify
		expect(eventName).toBe('beforeunload') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:closeNow')
		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(event).not.toHaveProperty('returnValue')
	})

	test('onBeforeWindowClose delays closing when preventClose is called', () => {
		// setup
		enableWindowCloseDispatcher()
		const [eventName, onBeforeWindowClose] = window.addEventListener.mock.calls[0]
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
		expect(eventName).toBe('beforeunload') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).not.toHaveBeenCalledWith('window:closeNow')
		expect(event.preventDefault).toHaveBeenCalled()
		expect(event).toHaveProperty('returnValue', '')
	})

	test('visibilitychange calls onBeforeWindowClose', () => {
		// setup
		enableWindowCloseDispatcher()
		const [eventName, onVisibilityChange] = window.addEventListener.mock.calls[2]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		visibilityState = 'hidden'
		onVisibilityChange(event)

		// verify
		expect(eventName).toBe('visibilitychange') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:closeNow')
	})

	test('visibilitychange doesnt call onBeforeWindowClose when not hidden', () => {
		// setup
		enableWindowCloseDispatcher()
		const [eventName, onVisibilityChange] = window.addEventListener.mock.calls[2]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		visibilityState = 'visible'
		onVisibilityChange(event)

		// verify
		expect(eventName).toBe('visibilitychange') // make sure we got the right listeners
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})
})
