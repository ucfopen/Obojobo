import ObojoboDraft from 'ObojoboDraft';
import Viewer from 'Viewer';

import 'ObojoboDraft/default-viewer-chunks'

import './polyfills'

let { APIUtil } = Viewer.util;

let { OboGlobals } = ObojoboDraft.util;

var debounce = function(ms, cb) {
	clearTimeout(debounce.id);
	return debounce.id = setTimeout(cb, ms);
};
debounce.id = null;

// set up global event listeners
let { Dispatcher } = ObojoboDraft.flux;

// Set up listeners for window for blur/focus
let onFocus = function() {
	document.body.className = 'is-focused-window';
	return Dispatcher.trigger('window:focus');
};

let onBlur = function() {
	document.body.className = 'is-blured-window';
	return Dispatcher.trigger('window:blur');
};

let ie = false;
//@cc_on ie = true;
if (ie) {
	document.onfocusin = onFocus;
	document.onfocusout = onBlur;
} else {
	window.onfocus = onFocus;
	window.onblur = onBlur;
}


let moduleData = {
	model: null,
	navState: null,
	scoreState: null,
	questionState: null,
	assessmentState: null,
	modalState: null
};

let render = () => {
	return ReactDOM.render(<div className="root">
		<Viewer.components.ViewerApp />
	</div>, document.getElementById('viewer-app'));
};


history.replaceState('', document.title, `/view/${OboGlobals.get('draftId')}${window.location.search}`);


render();