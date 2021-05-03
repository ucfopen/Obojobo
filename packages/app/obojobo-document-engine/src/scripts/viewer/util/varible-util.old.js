import Common from 'Common'

const { Dispatcher } = Common.flux

const VariableUtil = {
	getKey(ownerId, varName) {
		return `${ownerId}:${varName}`
	},

	clear(id, name, context) {
		return Dispatcher.trigger('variable:clear', {
			value: {
				id,
				name,
				context
			}
		})
	},

	clearAll(id, context) {
		return Dispatcher.trigger('variable:clearAll', {
			value: {
				id,
				context
			}
		})
	},

	setValue(id, name, value, context) {
		return Dispatcher.trigger('variable:setValue', {
			value: {
				id,
				name,
				value,
				context
			}
		})
	},

	regenerateValue(id, name, context) {
		return Dispatcher.trigger('variable:regenerateValue', {
			value: {
				id,
				name,
				context
			}
		})
	},

	getStateForContext(state, context) {
		return state.contexts[context] || null
	},

	// Non-recursive!
	generateAndGetValue(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		if (!VariableUtil.hasDefinition(context, state, ownerId, varName)) {
			console.log('no def for', ownerId, varName)
			return null
		}

		if (!VariableUtil.isValueGenerated(context, state, ownerId, varName)) {
			VariableUtil.regenerateValue(context, ownerId, varName)
		}

		return VariableUtil.getValue(context, state, ownerId, varName)
	},

	getOwnerOfVariable(context, state, model, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		const ownerId = model.get('id')

		if (VariableUtil.hasDefinition(context, state, ownerId, varName)) {
			return model
		}

		if (model.parent) {
			return VariableUtil.getOwnerOfVariable(context, state, model.parent, varName)
		}

		return null
	},

	// Recursive!
	generateAndGetValueForModel(context, state, model, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		const owner = VariableUtil.getOwnerOfVariable(context, state, model, varName)
		console.log('gagvfm', context, state, model, varName, contextState, owner)
		if (!owner) {
			return null
		}

		return VariableUtil.generateAndGetValue(context, state, owner.get('id'), varName)
		// const ownerId = model.get('id')

		// console.log('gagvfm', ownerId, varName, VariableUtil.hasDefinition(state, ownerId, varName))

		// if (VariableUtil.hasDefinition(state, ownerId, varName)) {
		// 	return VariableUtil.generateAndGetValue(state, ownerId, varName)
		// }

		// if (model.parent) {
		// 	return VariableUtil.generateAndGetValueForModel(state, model.parent, varName)
		// }

		// return null
	},

	getDefinition(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		const key = VariableUtil.getKey(ownerId, varName)
		return VariableUtil.hasDefinition(context, state, ownerId, varName)
			? contextState.defs[key]
			: null
	},

	has(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return false

		const key = VariableUtil.getKey(ownerId, varName)
		return (
			typeof contextState.defs[key] !== 'undefined' ||
			typeof contextState.values[key] !== 'undefined'
		)
	},

	getValue(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		if (!VariableUtil.isValueGenerated(context, state, ownerId, varName)) {
			return null
		}

		return contextState.values[VariableUtil.getKey(ownerId, varName)]
	},

	hasDefinition(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return false

		const key = VariableUtil.getKey(ownerId, varName)
		return typeof contextState.defs[key] !== 'undefined'
	},

	isValueGenerated(context, state, ownerId, varName) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		const key = VariableUtil.getKey(ownerId, varName)
		return typeof contextState.values[key] !== 'undefined'
	},

	getVariableStateSummary(context, state) {
		const contextState = VariableUtil.getStateForContext(state, context)
		if (!contextState) return null

		return { ...contextState.values }
	}
}

export default VariableUtil
