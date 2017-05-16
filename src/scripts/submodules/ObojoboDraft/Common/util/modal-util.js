import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher';

let ModalUtil = {
	show(component) {
		return Dispatcher.trigger('modal:show', {
			value: {
				component
			}
		}
		);
	},

	hide() {
		return Dispatcher.trigger('modal:hide');
	},

	getCurrentModal(state) {
		if (state.modals.length === 0) { return null; }
		return state.modals[0];
	}
};


export default ModalUtil;