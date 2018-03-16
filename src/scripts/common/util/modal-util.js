import Dispatcher from '../../common/flux/dispatcher'

let ModalUtil = {
	show(component, hideViewer = false) {
		Dispatcher.trigger('modal:show', {
			value: { component, hideViewer }
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
