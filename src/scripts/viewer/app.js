import Common from 'Common'
import { Provider } from 'react-redux'
let { ViewerStore } = Viewer.stores
let { Dispatcher } = Common.flux
import './polyfills'

let { APIUtil } = Viewer.util

var debounce = (ms, cb) => {
	clearTimeout(debounce.id)
	debounce.id = setTimeout(cb, ms)
}
debounce.id = null

// Set up listeners for window for blur/focus
let onFocus = () => {
	document.body.className = 'is-focused-window'
	Dispatcher.trigger('window:focus')
}

let onBlur = () => {
	document.body.className = 'is-blured-window'
	Dispatcher.trigger('window:blur')
}

let ie = false
//@cc_on ie = true;
if (ie) {
	document.onfocusin = onFocus
	document.onfocusout = onBlur
} else {
	window.onfocus = onFocus
	window.onblur = onBlur
}

window.__oboViewerRender = () => {
	return ReactDOM.render(
		<Provider store={ViewerStore}>
			<div className="root">
				<Viewer.components.ViewerApp />
			</div>
		</Provider>,
		document.getElementById('viewer-app')
	)
}

