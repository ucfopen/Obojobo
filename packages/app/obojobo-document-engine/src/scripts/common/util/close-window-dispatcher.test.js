jest.mock('../flux/dispatcher', () => ({
	trigger: jest.fn()
}))

describe('Close Window Dispatcher', () => {
	let visibilityState = 'visible'
	let enableWindowCloseDispatcher
	let Dispatcher
	beforeEach(() => {
		jest.resetModules()
		jest.clearAllMocks()

		// require + resetModules to ensure internal vars are reset between tests
		Dispatcher = require('../flux/dispatcher')
		enableWindowCloseDispatcher = require('./close-window-dispatcher').default

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

	test('onBeforeUnload dispatches closeAttempt', () => {
		// setup
		enableWindowCloseDispatcher()
		const [listerEventName, onBeforeUnload] = window.addEventListener.mock.calls[0]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		onBeforeUnload(event)

		// verify
		expect(listerEventName).toBe('beforeunload') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).not.toHaveBeenLastCalledWith('window:closeNow')
		expect(event.preventDefault).not.toHaveBeenCalled()
		expect(event).not.toHaveProperty('returnValue')
	})

	test('onBeforeWindowClose delays closing when preventClose is called', () => {
		// setup
		enableWindowCloseDispatcher()
		const [listerEventName, onBeforeWindowClose] = window.addEventListener.mock.calls[0]
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
		expect(listerEventName).toBe('beforeunload') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenCalledWith('window:closeAttempt', expect.any(Function))
		expect(Dispatcher.trigger).not.toHaveBeenCalledWith('window:closeNow')
		expect(event.preventDefault).toHaveBeenCalled()
		expect(event).toHaveProperty('returnValue', '')
	})

	test('unload triggers window:closeNow', () => {
		// setup
		enableWindowCloseDispatcher()
		const [listerEventName, dispatchCloseNow] = window.addEventListener.mock.calls[2]

		// execute
		dispatchCloseNow()

		// verify
		expect(listerEventName).toBe('unload') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:closeNow')
	})

	test('visibilitychange triggers window:closeNow', () => {
		// setup
		enableWindowCloseDispatcher()
		const [listerEventName, onVisibilityChange] = window.addEventListener.mock.calls[3]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		visibilityState = 'hidden'
		onVisibilityChange(event)

		// verify
		expect(listerEventName).toBe('visibilitychange') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:closeNow')
	})

	test('visibilitychange doesnt call onBeforeWindowClose when not hidden', () => {
		// setup
		enableWindowCloseDispatcher()
		const [listerEventName, onVisibilityChange] = window.addEventListener.mock.calls[3]
		const event = {
			preventDefault: jest.fn()
		}

		// execute
		visibilityState = 'visible'
		onVisibilityChange(event)

		// verify
		expect(listerEventName).toBe('visibilitychange') // make sure we got the right listeners
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('dispatchCloseNow triggers window:closeNow once', () => {
		// setup
		enableWindowCloseDispatcher()
		const [listerEventName, dispatchCloseNow] = window.addEventListener.mock.calls[2]

		// execute repeatidly
		dispatchCloseNow()
		dispatchCloseNow()
		dispatchCloseNow()

		// verify
		expect(listerEventName).toBe('unload') // make sure we got the right listeners
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
	})
})
