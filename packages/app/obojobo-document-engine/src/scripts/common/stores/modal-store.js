import Store from '../flux/store'
import Dispatcher from '../flux/dispatcher'
import focus from '../page/focus'

class ModalStore extends Store {
	constructor() {
		super('modalstore')

		Dispatcher.on('modal:show', (payload, status) => {
			const id = this._show(payload.value)
			status.id = id
		})

		Dispatcher.on('modal:hide', this._hide.bind(this))
	}

	init() {
		return (this.state = {
			idOrder: [],
			modalsById: {},
			nextId: 1
		})
	}

	_getCurrentModal() {
		return this.state.idOrder.length > 0
			? this.state.modalsById[this.state.idOrder[this.state.idOrder.length - 1]]
			: null
	}

	_addModal(modalItem) {
		const id = '' + this.state.nextId++

		this.state.idOrder.push(id)

		modalItem.id = id
		modalItem.index = this.state.idOrder.length - 1
		modalItem.lastActiveElement = document.activeElement

		this.state.modalsById[id] = modalItem

		return id
	}

	_removeModal(id) {
		const modalItem = this.state.modalsById[id]

		if (!modalItem) {
			return false
		}

		delete this.state.modalsById[id]
		this.state.idOrder.splice(modalItem.index, 1)

		return true
	}

	_show(modalItem) {
		// this.lastActiveElement = document.activeElement
		// this.state.modals.push(modalItem)
		// this.triggerChange()
		const id = this._addModal(modalItem)
		this.triggerChange()

		return id
	}

	_hide() {
		const currentModal = this._getCurrentModal()

		if (!currentModal) {
			return
		}

		if (this._removeModal(currentModal.id)) {
			this.triggerChange()

			if (
				currentModal.lastActiveElement &&
				document.body.contains(currentModal.lastActiveElement)
			) {
				focus(currentModal.lastActiveElement)
			}

			Dispatcher.trigger('modal:hidden', currentModal)
		}
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

const modalStore = new ModalStore()
export default modalStore
