import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Common from 'Common'
import Viewer from 'Viewer'
import reducer from './redux-store/reducer'

import './polyfills'

const debounce = function(ms, cb) {
	clearTimeout(debounce.id)
	return (debounce.id = setTimeout(cb, ms))
}
debounce.id = null

// set up global event listeners
const { Dispatcher } = Common.flux

// Set up listeners for window for blur/focus
const onFocus = function() {
	document.body.className = 'is-focused-window'
	return Dispatcher.trigger('window:focus')
}

const onBlur = function() {
	document.body.className = 'is-blured-window'
	return Dispatcher.trigger('window:blur')
}

const ie = false
//@cc_on ie = true;
if (ie) {
	document.onfocusin = onFocus
	document.onfocusout = onBlur
} else {
	window.onfocus = onFocus
	window.onblur = onBlur
}

// Set up Redux store
const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

window.__oboViewerRender = () => {
	ReactDOM.render(
		<Provider store={store}>
			<div className="root">
				<Viewer.components.ViewerApp />
			</div>
		</Provider>,
		document.getElementById('viewer-app')
	)
}
