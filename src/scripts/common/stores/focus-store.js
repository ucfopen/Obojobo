import Store from '../../common/flux/store'
import Dispatcher from '../../common/flux/dispatcher'
import OboModel from '../../common/models/obo-model'

const TRANSITION_TIME_MS = 800
let timeoutId = null

class FocusStore extends Store {
	constructor() {
		super('focusStore')

		this.boundOnDocumentFocusIn = this.onDocumentFocusIn.bind(this)

		Dispatcher.on('focus:component', payload => {
			this._focus(payload.value.id)
		})

		Dispatcher.on('focus:unfocus', this._unfocus.bind(this))
	}

	init() {
		this.state = {
			focussedId: null,
			viewState: 'inactive'
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

	_focus(id) {
		document.addEventListener('focusin', this.boundOnDocumentFocusIn)

		this.state.viewState = 'enter'
		this.state.focussedId = id

		this.triggerChange()

		if (OboModel.models[this.state.focussedId]) {
			const domEl = OboModel.models[this.state.focussedId].getDomEl()
			if (domEl && domEl.focus) domEl.focus()
		}

		window.clearTimeout(timeoutId)
		timeoutId = window.setTimeout(() => {
			this.state.viewState = 'active'
			this.triggerChange()
		}, TRANSITION_TIME_MS)
	}

	_unfocus() {
		document.removeEventListener('focusin', this.boundOnDocumentFocusIn)

		this.state.viewState = 'leave'
		this.triggerChange()

		window.clearTimeout(timeoutId)
		timeoutId = window.setTimeout(() => {
			this.state.viewState = 'inactive'
			this.state.focussedId = null
			this.triggerChange()
		}, TRANSITION_TIME_MS)
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

const focusStore = new FocusStore()
export default focusStore
