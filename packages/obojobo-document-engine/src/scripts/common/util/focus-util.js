import Dispatcher from '../../common/flux/dispatcher'
import OboModel from '../../common/models/obo-model'

const FocusUtil = {
	focusComponent(id, isVisuallyFocused = true) {
		Dispatcher.trigger('focus:component', {
			value: { id, isVisuallyFocused }
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
