import Common from 'Common'
import Viewer from 'Viewer'
import React from 'react'
import ReactDOM from 'react-dom'
import './polyfills'
const { Dispatcher } = Common.flux
const { ErrorBoundary } = Common.components

// get the visit and draft from the url
const urlTokens = document.location.pathname.split('/')
const visitId = urlTokens[4] ? urlTokens[4] : null
const draftId = urlTokens[2] ? urlTokens[2] : null

const debounce = function(ms, cb) {
	clearTimeout(debounce.id)
	return (debounce.id = setTimeout(cb, ms))
}
debounce.id = null

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

window.__oboViewerRender = () => {
	ReactDOM.render(
		<div className="root">
			<ErrorBoundary>
				<Viewer.components.ViewerApp visitId={visitId} draftId={draftId} />
			</ErrorBoundary>
		</div>,
		document.getElementById('viewer-app')
	)
}
