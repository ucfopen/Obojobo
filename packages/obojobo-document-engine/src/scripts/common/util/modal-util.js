import Dispatcher from '../../common/flux/dispatcher'

let ModalUtil = {
	show(component) {
		Dispatcher.trigger('modal:show', {
			value: { component }
		})
	},

	hide() {
		Dispatcher.trigger('modal:hide')
	},

	getCurrentModal(state) {
		if (state.modals.length === 0) {
			return null
		}
		return state.modals[0]
	}
}

export default ModalUtil
