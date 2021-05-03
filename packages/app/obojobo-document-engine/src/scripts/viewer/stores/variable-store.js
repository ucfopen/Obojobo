import Common from 'Common'
import VariableUtil from '../util/variable-util'
// import VariableGenerator from './variable-store/variable-generator'

const { Store } = Common.flux
const { Dispatcher } = Common.flux

const getNewContextState = () => {
	return {
		values: {},
		varNamesByOwnerId: {}
	}
}

class VariableStore extends Store {
	constructor() {
		super('variableStore')
	}

	_addMultiple(context, values) {
		values.forEach(({ id, value }) => {
			const [ownerId, varName] = id.split(':')
			this._add(context, ownerId, varName, value)
		})
	}

	_add(context, ownerId, varName, value) {
		const contextState = this.getOrCreateContextState(context)

		if (!contextState.varNamesByOwnerId[ownerId]) {
			contextState.varNamesByOwnerId[ownerId] = {}
		}

		contextState.varNamesByOwnerId[ownerId][varName] = true
		contextState.values[VariableUtil.getKey(ownerId, varName)] = value
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

	init(variableValues) {
		this.state = {
			contexts: {
				practice: getNewContextState()
			}
		}

		// this._addVariablesForModel('practice', variableState)
		this._addMultiple('practice', variableValues)
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
