import Dispatcher from './dispatcher'

class Store {
	constructor(name) {
		this.name = name
	}

	init() {
		return (this.state = {})
	}

	triggerChange() {
		return Dispatcher.trigger(`${this.name}:change`)
	}

	onChange(callback) {
		return Dispatcher.on(`${this.name}:change`, callback)
	}

	offChange(callback) {
		return Dispatcher.off(`${this.name}:change`, callback)
	}

	setAndTrigger(keyValues) {
		Object.assign(this.state, keyValues) // merge args onto defaults
		return this.triggerChange()
	}

	getState() {
		return Object.assign({}, this.state)
	}

	setState(newState) {
		return (this.state = Object.assign({}, newState))
	}

	updateStateByContext(obj, context) {
		for (let key in obj) {
			if (!this.state[key]) this.state[key] = {}
			this.state[key][context] = obj[key]
		}
	}
}

export default Store
