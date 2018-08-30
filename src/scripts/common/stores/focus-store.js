import Store from '../../common/flux/store'
import Dispatcher from '../../common/flux/dispatcher'
import OboModel from '../../common/models/obo-model'

class FocusStore extends Store {
	constructor() {
		super('focusStore')

		this.boundOnDocumentFocusIn = this.onDocumentFocusIn.bind(this)

		Dispatcher.on('focus:component', payload => {
			this._focus(payload.value.id, payload.value.isVisuallyFocused)
		})

		Dispatcher.on('focus:unfocus', this._unfocus.bind(this))
	}

	init() {
		this.state = {
			focussedId: null,
			viewState: FocusStore.VIEW_STATE_INACTIVE
		}
	}

	onDocumentFocusIn(event) {
		// When focusing on another element we want to remove
		// the focus effect if the element is not part of the focused element
		let focussedElement
		const focussedModel = OboModel.models[this.state.focussedId]
		if (focussedModel) focussedElement = focussedModel.getDomEl()

		if (!focussedElement || !focussedElement.contains(event.target)) {
			this._unfocus()
		}
	}

	_focus(id, isVisuallyFocused = true) {
		if (OboModel.models[id]) {
			const domEl = OboModel.models[id].getDomEl()
			if (domEl && domEl.focus) domEl.focus()
		}
		this.state.focussedId = id

		document.addEventListener('focusin', this.boundOnDocumentFocusIn)

		if (isVisuallyFocused) {
			this.state.viewState = FocusStore.VIEW_STATE_ACTIVE
		}

		this.triggerChange()
	}

	_unfocus() {
		document.removeEventListener('focusin', this.boundOnDocumentFocusIn)

		this.state.viewState = FocusStore.VIEW_STATE_INACTIVE
		this.state.focussedId = null
		this.triggerChange()
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

FocusStore.VIEW_STATE_INACTIVE = 'inactive'
FocusStore.VIEW_STATE_ACTIVE = 'active'

const focusStore = new FocusStore()
export default focusStore
