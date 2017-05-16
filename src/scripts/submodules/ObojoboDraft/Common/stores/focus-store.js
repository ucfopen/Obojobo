import Store from 'ObojoboDraft/Common/flux/store';
import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher';

let TRANSITION_TIME_MS = 800;
let timeoutId = null;

class FocusStore extends Store {
	constructor() {
		super('focusStore');

		Dispatcher.on('focus:component', payload => {
			this.state.viewState = 'enter';
			this.state.focussedId = payload.value.id;
			this.triggerChange();

			window.clearTimeout(timeoutId);
			return timeoutId = window.setTimeout((() => {
				this.state.viewState = 'active';
				return this.triggerChange();
			}), TRANSITION_TIME_MS);
		});

		Dispatcher.on('focus:unfocus', payload => {
			this.state.viewState = 'leave';
			this.triggerChange();

			window.clearTimeout(timeoutId);
			return timeoutId = window.setTimeout((() => {
				this.state.viewState = 'inactive';
				this.state.focussedId = null;
				return this.triggerChange();
			}), TRANSITION_TIME_MS);
		});
	}

	init() {
		return this.state = {
			focussedId: null,
			viewState: 'inactive'
		};
	}

	getState() { return this.state; }

	setState(newState) { return this.state = newState; }
}


let focusStore = new FocusStore();
export default focusStore;
