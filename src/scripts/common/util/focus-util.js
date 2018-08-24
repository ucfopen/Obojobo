import Dispatcher from '../../common/flux/dispatcher'
import OboModel from '../../common/models/obo-model'

const FocusUtil = {
	focusComponent(id) {
		Dispatcher.trigger('focus:component', {
			value: { id }
		})
	},

	unfocus() {
		Dispatcher.trigger('focus:unfocus')
	},

	getFocussedComponent(state) {
		return OboModel.models[state.focussedId] || null
	}
}

export default FocusUtil
