import Dispatcher from '../flux/dispatcher'

// flag to prevent calling closeNow multiple times
let closeNowTriggered = false

// trigger the event that will release the editor's lock
const dispatchCloseNow = () => {
	if (!closeNowTriggered) {
		Dispatcher.trigger('window:closeNow')
		closeNowTriggered = true
	}
}

// allow editor to prompt for window close
const onBeforeUnload = event => {
	let closePrevented = false

	// calling this function will prevent the window from closing
	const preventClose = () => {
		closePrevented = true
	}

	// notify listeners, and let them cancel closing by calling preventClose
	Dispatcher.trigger('window:closeAttempt', preventClose)

	if (closePrevented) {
		// Prompt user to Confirm leaving page
		// NOTE if the user clicks
		event.preventDefault() // Cancel the event as stated by the standard.
		event.returnValue = '' // Chrome requires returnValue to be set.
	}
}

const enableWindowCloseDispatcher = () => {
	// listen for all close events that would allow us to remove our lock
	window.addEventListener('beforeunload', onBeforeUnload) // all

	// detect when tab/window is closing with time to call sendBeacon to remove lock
	// using pagehide and visibilityState to support multiple browsers
	// note that the order that these fire may change in the html spec
	// https://github.com/whatwg/html/issues/3957
	window.addEventListener('pagehide', dispatchCloseNow)
	window.addEventListener('unload', dispatchCloseNow)

	// if this browser supports visibilityState
	if (window.visibilityState) {
		const onVisibilityChange = event => {
			if (window.visibilityState === 'hidden') dispatchCloseNow(event)
		}

		window.addEventListener('visibilitychange', onVisibilityChange)
	}
}

export default enableWindowCloseDispatcher
