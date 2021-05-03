import Common from 'Common'

const { Dispatcher } = Common.flux

const VariableUtil = {
	getKey(ownerId, varName) {
		return `${ownerId}:${varName}`
	},

	getStateForContext(state, context) {
		return state.contexts[context] || null
	},

	getOwnerOfVariable(context, state, model, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		const ownerId = model.get('id')

		if (VariableUtil.hasValue(context, state, ownerId, varName)) {
			return model
		}

		if (model.parent) {
			return VariableUtil.getOwnerOfVariable(context, state, model.parent, varName)
		}

		return null
	},

	// Recursive!
	findValueWithModel(context, state, model, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		const owner = VariableUtil.getOwnerOfVariable(context, state, model, varName)
		if (!owner) {
			return null
		}

		return VariableUtil.getValue(context, state, owner.get('id'), varName)
	},

	hasValue(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return false

		const key = VariableUtil.getKey(ownerId, varName)
		return typeof contextState.values[key] !== 'undefined'
	},

	getValue(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.values[VariableUtil.getKey(ownerId, varName)]
	},

	getVariableStateSummary(context, state) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		return { ...contextState.values }
	}
}

export default VariableUtil
