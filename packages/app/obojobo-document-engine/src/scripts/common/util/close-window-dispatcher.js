import Dispatcher from '../flux/dispatcher'

const onBeforeWindowClose = event => {
	let closePrevented = false
	// calling this function will prevent the window from closing
	const preventClose = () => {
		closePrevented = true
	}

	// notify listeners, and let them cancel closing
	Dispatcher.trigger('window:closeAttempt', preventClose)

	if (closePrevented) {
		// Confirm leaving page
		event.preventDefault() // Cancel the event as stated by the standard.
		event.returnValue = '' // Chrome requires returnValue to be set.
	} else {
		Dispatcher.trigger('window:closeNow')
	}
}

const enableWindowCloseDispatcher = () => {
	// listen for all close events that would allow us to remove our lock
	window.addEventListener('beforeunload', onBeforeWindowClose)
	window.addEventListener('pagehide', onBeforeWindowClose)

	// if this browser supports visibilityState
	if (window.visibilityState) {
		const onVisibilityChange = event => {
			if (window.visibilityState === 'hidden') onBeforeWindowClose(event)
		}

		window.addEventListener('visibilitychange', onVisibilityChange)
	}
}

export default enableWindowCloseDispatcher
