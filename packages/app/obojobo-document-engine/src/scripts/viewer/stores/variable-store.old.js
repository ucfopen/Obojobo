import Common from 'Common'
import VariableUtil from '../util/varible-util'
import VariableGenerator from './variable-store/variable-generator'

const { Store } = Common.flux
const { Dispatcher } = Common.flux

const getNewContextState = () => {
	return {
		defs: {},
		values: {},
		varNamesByOwnerId: {}
	}
}

class VariableStore extends Store {
	constructor() {
		super('variableStore')

		Dispatcher.on({
			'variable:clear': this.clear.bind(this),
			'variable:clearAll': this.clearAll.bind(this),
			'variable:setValue': this.setValue.bind(this),
			'variable:regenerateValue': this.regenerateValue.bind(this)
		})
	}

	_clearValue(context, ownerId, varName) {
		const contextState = this.getOrCreateContextState(context)
		const key = VariableUtil.getKey(ownerId, varName)

		delete contextState.values[key]
	}

	_setValue(context, ownerId, varName, value) {
		const contextState = this.getOrCreateContextState(context)
		const key = VariableUtil.getKey(ownerId, varName)

		contextState.values[key] = value
	}

	_setDefinition(context, ownerId, varName, definition) {
		const contextState = this.getOrCreateContextState(context)
		const key = VariableUtil.getKey(ownerId, varName)

		contextState.defs[key] = definition
	}

	_add(context, ownerId, varName, varDefintion, generateValue) {
		const contextState = this.getOrCreateContextState(context)

		this._setDefinition(context, ownerId, varName, varDefintion)

		if (!contextState.varNamesByOwnerId[ownerId]) {
			contextState.varNamesByOwnerId[ownerId] = {}
		}
		contextState.varNamesByOwnerId[ownerId][varName] = true

		if (generateValue) {
			this._generateValue(context, ownerId, varName)
		}
	}

	_addMultiple(context, ownerId, variableDefinitions = [], generateValue) {
		variableDefinitions.forEach(v => {
			this._add(context, ownerId, v.name, { ...v }, generateValue)
		})
	}

	_remove(context, ownerId, varName) {
		const contextState = this.getOrCreateContextState(context)

		this._clearValue(context, ownerId, varName)
		const key = VariableUtil.getKey(ownerId, varName)

		delete contextState.defs[key]
		delete contextState.varNamesByOwnerId[ownerId][varName]

		if (Object.keys(contextState.varNamesByOwnerId[ownerId]).length === 0) {
			delete contextState.varNamesByOwnerId[ownerId]
		}
	}

	_removeAll(context, ownerId) {
		const contextState = this.getOrCreateContextState(context)

		Object.keys(contextState.varNamesByOwnerId[ownerId]).forEach(varName => {
			this._remove(context, ownerId, varName)
		})
	}

	_generateValue(context, ownerId, varName) {
		this.getOrCreateContextState(context)

		const value = VariableGenerator.generateOne(
			VariableUtil.getDefinition(context, this.state, ownerId, varName)
		)

		this._setValue(context, ownerId, varName, value)

		return value
	}

	_addVariablesForModel(context, model) {
		if (model.vars) {
			this._addMultiple(context, model.get('id'), model.vars, true)
		}

		if (model.children) {
			model.children.models.forEach(child => this._addVariablesForModel(context, child))
		}
	}

	clear(payload) {
		const ownerId = payload.value.id
		const varName = payload.value.name
		const context = payload.value.context

		this._clear(context, ownerId, varName)

		this.triggerChange()

		Dispatcher.trigger('variable:cleared', { context, id: ownerId, name: varName })
	}

	clearAll(payload) {
		const contextState = this.getOrCreateContextState(context)

		const ownerId = payload.value.id
		const context = payload.value.context

		Object.keys(contextState.varNamesByOwnerId[ownerId]).forEach(varName => {
			this._clear(context, ownerId, varName)
		})

		this.triggerChange()

		Dispatcher.trigger('variable:clearedAll', { context, id: ownerId })
	}

	setValue(payload) {
		const ownerId = payload.value.id
		const varName = payload.value.name
		const value = payload.value.value
		const context = payload.value.context

		this._setValue(context, ownerId, varName)

		this.triggerChange()

		Dispatcher.trigger('variable:valueSet', { context, id: ownerId, name: varName, value })
	}

	regenerateValue(payload) {
		const ownerId = payload.value.id
		const varName = payload.value.name
		const context = payload.value.context

		const value = this._generateValue(context, ownerId, varName)

		this.triggerChange()

		Dispatcher.trigger('variable:valueRegenerated', { context, id: ownerId, name: varName, value })
	}

	getContextState(context) {
		return this.state.contexts[context] || null
	}

	hasContextState(context) {
		return this.getContextState(context) !== null
	}

	getOrCreateContextState(context) {
		let contextState = this.getContextState(context)

		if (!contextState) {
			contextState = getNewContextState()
			this.state.contexts[context] = contextState
		}

		return contextState
	}

	init(model) {
		this.state = {
			contexts: {
				practice: getNewContextState()
			}
		}

		this._addVariablesForModel('practice', model)
	}

	getState() {
		return this.state
	}

	setState(newState) {
		this.state = newState
	}
}

const variableStore = new VariableStore()

window.__vs = variableStore

export default variableStore
