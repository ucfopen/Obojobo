import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher';
import OboModel from 'ObojoboDraft/Common/models/obo-model';

let FocusUtil = {
	focusComponent(id) {
		return Dispatcher.trigger('focus:component', {
			value: {
				id
			}
		}
		);
	},

	unfocus() {
		return Dispatcher.trigger('focus:unfocus');
	},

	getFocussedComponent(state) {
		return OboModel.models[state.focussedId];
	}
};



export default FocusUtil;