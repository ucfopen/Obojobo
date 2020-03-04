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
	window.addEventListener('beforeunload', onBeforeWindowClose)
}

export default enableWindowCloseDispatcher
