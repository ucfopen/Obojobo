import ReactDOM from 'react-dom'

import Dispatcher from '../flux/dispatcher'
import ModalContainer from '../components/modal-container'

const ModalUtil = {
	show(component, hideViewer = false, isPortal = false) {
		// let portal = null

		// if (isPortal) {
		// 	portal = ReactDOM.createPortal(component, document.getElementById(ModalContainer.DOM_ID))
		// }
		// const portal = ReactDOM.createPortal(component, document.body)

		// debugger
		const status = {}
		Dispatcher.trigger(
			'modal:show',
			{
				value: { component, hideViewer, isPortal }
			},
			status
		)

		return status.id
		// return portal
	},

	hide() {
		Dispatcher.trigger('modal:hide')
	},

	hasDialog(id, state) {
		return typeof state.modalsById[id] !== 'undefined'
	},

	getCurrentModal(state) {
		if (state.idOrder.length === 0) {
			return null
		}

		return state.modalsById[state.idOrder[state.idOrder.length - 1]] || null
	}
}

window.MU = ModalUtil

export default ModalUtil
