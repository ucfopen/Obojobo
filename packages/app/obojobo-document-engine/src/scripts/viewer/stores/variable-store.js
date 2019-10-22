import Common from 'Common'

import Variables from '../vars/variables'

const { Store } = Common.flux
const { Dispatcher } = Common.flux

class VariableStore extends Store {
	constructor() {
		super('variableStore')

		Dispatcher.on({
			'variable:clear': this.clear.bind(this),
			'variable:clearAll': this.clearAll.bind(this),
			'variable:setValue': this.setValue.bind(this)
		})
	}

	clear(payload) {
		const id = payload.value.id
		const name = payload.value.name

		Variables.clearValue(id, name)

		this.state = Variables.toObject()

		this.triggerChange()

		Dispatcher.trigger('variable:cleared', { id, name })
	}

	clearAll(payload) {
		const id = payload.value.id

		Variables.clearAllValues(id)

		this.state = Variables.toObject()

		this.triggerChange()

		Dispatcher.trigger('variable:clearedAll', { id })
	}

	setValue(payload) {
		const id = payload.value.id
		const name = payload.value.name
		const value = payload.value.value

		Variables.setValue(id, name, value)

		this.state = Variables.toObject()

		this.triggerChange()

		Dispatcher.trigger('variable:valueSet', { id, name, value })
	}

	init() {
		this.state = Variables.toObject()
	}

	getState() {
		return Variables.toObject()
	}

	setState(newState) {
		this.state = newState
	}
}

const variableStore = new VariableStore()

export default variableStore
