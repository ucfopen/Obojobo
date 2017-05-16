import Store from 'ObojoboDraft/Common/flux/store';
import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher';


class ModalStore extends Store {
	constructor() {
		super('modalstore');

		Dispatcher.on('modal:show', payload => {
			this.state.modals.push(payload.value.component);
			return this.triggerChange();
		});

		Dispatcher.on('modal:hide', () => {
			this.state.modals.shift();
			return this.triggerChange();
		});
	}

	init() {
		return this.state = {
			modals: []
		};
	}

	getState() { return this.state; }

	setState(newState) { return this.state = newState; }
}


let modalStore = new ModalStore();
export default modalStore;
