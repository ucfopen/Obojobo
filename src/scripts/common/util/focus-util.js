import Dispatcher from '../../common/flux/dispatcher';
import OboModel from '../../common/models/obo-model';

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