import Dispatcher from '../flux/dispatcher'

const ModalUtil = {
	show(component, hideViewer = false) {
		Dispatcher.trigger('modal:show',
			{ value: { component, hideViewer }
		})
	},

	hide() {
		Dispatcher.trigger('modal:hide')
	},

	getCurrentModal(state) {
		// return state.modalsById[state.idOrder[state.idOrder.length - 1]] || null
		if (state.modals.length === 0) return null
		return state.modals[0]
	}
}

export default ModalUtil
