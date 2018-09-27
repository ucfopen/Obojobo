import Store from '../../common/flux/store'
import Dispatcher from '../../common/flux/dispatcher'

const TRANSITION_TIME_MS = 800
let timeoutId = null

class FocusStore extends Store {
	constructor() {
		super('focusStore')

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

	_focus(id) {
		this.state.viewState = 'enter'
		this.state.focussedId = id
		this.triggerChange()

		window.clearTimeout(timeoutId)
		timeoutId = window.setTimeout(() => {
			this.state.viewState = 'active'
			this.triggerChange()
		}, TRANSITION_TIME_MS)
	}

	_unfocus() {
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
