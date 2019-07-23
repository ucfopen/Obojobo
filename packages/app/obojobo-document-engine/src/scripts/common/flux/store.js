import Dispatcher from './dispatcher'

class Store {
	constructor(name) {
		this.name = name
	}

	init() {
		this.state = {}
	}

	triggerChange() {
		Dispatcher.trigger(`${this.name}:change`)
	}

	onChange(callback) {
		Dispatcher.on(`${this.name}:change`, callback)
	}

	offChange(callback) {
		Dispatcher.off(`${this.name}:change`, callback)
	}

	setAndTrigger(keyValues) {
		Object.assign(this.state, keyValues) // merge args onto defaults
		this.triggerChange()
	}

	getState() {
		return Object.assign({}, this.state)
	}

	setState(newState) {
		this.state = Object.assign({}, newState)
	}
}

export default Store
