// import VariableGenerator from './variable-generator'

// // import parse from './parser'

// const getKey = (ownerId, varName) => {
// 	return `${ownerId}:${varName}`
// }

// class Variables {
// 	static fromObject(o) {
// 		this.state.defs = { ...o.defs }
// 		this.state.values = { ...o.values }
// 		this.state.varNamesByOwnerId = { ...o.varNamesByOwnerId }
// 	}

// 	constructor(state) {
// 		this.init(state)
// 	}

// 	init(state) {
// 		this.state = state
// 	}

// 	getDefinition(ownerId, varName) {
// 		const key = getKey(ownerId, varName)
// 		return this.hasDefinition(ownerId, varName) ? this.state.defs[key] : null
// 	}

// 	has(ownerId, varName) {
// 		const key = getKey(ownerId, varName)
// 		return (
// 			typeof this.state.defs[key] !== 'undefined' || typeof this.state.values[key] !== 'undefined'
// 		)
// 	}

// 	getValue(ownerId, varName) {
// 		if (!this.isValueComputed(ownerId, varName)) {
// 			return null
// 		}

// 		return this.state.values[getKey(ownerId, varName)]
// 	}

// 	computeValue(ownerId, varName) {
// 		this.setValue(
// 			ownerId,
// 			varName,
// 			VariableGenerator.generateOne(this.getDefinition(ownerId, varName))
// 		)
// 	}

// 	getOrSetValue(ownerId, varName) {
// 		// console.log('we checking if has value', ownerId, varName, this.isValueComputed(ownerId, varName))
// 		if (!this.isValueComputed(ownerId, varName)) {
// 			this.computeValue(ownerId, varName)
// 		}

// 		return this.getValue(ownerId, varName)
// 	}

// 	// special case, if varDefintion is not an object we take that as the value too
// 	// add(ownerId, varName, varDefintionOrValue) {
// 	// 	// console.log('add', ownerId, varName, varDefintionOrValue)
// 	// 	if (typeof varDefintionOrValue !== 'object') {
// 	// 		const value = varDefintionOrValue
// 	// 		// this acts as the default:
// 	// 		console.log('parsey', value)
// 	// 		const parsedValue = parse(value)
// 	// 		this.setDefinition(ownerId, varName, parsedValue)
// 	// 		this.setValue(ownerId, varName, parsedValue)
// 	// 	} else {
// 	// 		const def = varDefintionOrValue
// 	// 		this.setDefinition(ownerId, varName, def)
// 	// 	}

// 	// 	if (!this.state.varNamesByOwnerId[ownerId]) {
// 	// 		this.state.varNamesByOwnerId[ownerId] = {}
// 	// 	}
// 	// 	this.state.varNamesByOwnerId[ownerId][varName] = true

// 	// 	this.computeValue(ownerId, varName)
// 	// }

// 	add(ownerId, varName, varDefintion, computeValue) {
// 		// console.log('add', ownerId, varName, varDefintionOrValue)

// 		this.setDefinition(ownerId, varName, varDefintion)

// 		if (!this.state.varNamesByOwnerId[ownerId]) {
// 			this.state.varNamesByOwnerId[ownerId] = {}
// 		}
// 		this.state.varNamesByOwnerId[ownerId][varName] = true

// 		if (computeValue) {
// 			this.computeValue(ownerId, varName)
// 		}
// 	}

// 	addMultiple(ownerId, variableDefinitions = [], computeValue) {
// 		variableDefinitions.forEach(v => {
// 			this.add(ownerId, v.name, { ...v }, computeValue)
// 		})
// 	}

// 	setDefinition(ownerId, varName, definition) {
// 		const key = getKey(ownerId, varName)
// 		this.state.defs[key] = definition
// 	}

// 	setValue(ownerId, varName, value) {
// 		const key = getKey(ownerId, varName)
// 		this.state.values[key] = value
// 	}

// 	hasDefinition(ownerId, varName) {
// 		const key = getKey(ownerId, varName)
// 		return typeof this.state.defs[key] !== 'undefined'
// 	}

// 	isValueComputed(ownerId, varName) {
// 		const key = getKey(ownerId, varName)
// 		return typeof this.state.values[key] !== 'undefined'
// 	}

// 	clearValue(ownerId, varName) {
// 		const key = getKey(ownerId, varName)

// 		if (this.isComputableVariable(ownerId, varName)) {
// 			delete this.state.values[key]
// 		} else {
// 			// reset to default
// 			this.setValue(ownerId, varName, this.getDefinition(ownerId, varName))
// 		}
// 	}

// 	clearAllValues(ownerId) {
// 		Object.keys(this.state.varNamesByOwnerId[ownerId]).forEach(varName => {
// 			this.clearValue(ownerId, varName)
// 		})
// 	}

// 	remove(ownerId, varName) {
// 		this.clearValue(ownerId, varName)
// 		const key = getKey(ownerId, varName)

// 		delete this.state.defs[key]
// 		delete this.state.varNamesByOwnerId[ownerId][varName]

// 		if (Object.keys(this.state.varNamesByOwnerId[ownerId]).length === 0) {
// 			delete this.state.varNamesByOwnerId[ownerId]
// 		}
// 	}

// 	removeAll(ownerId) {
// 		Object.keys(this.state.varNamesByOwnerId[ownerId]).forEach(varName => {
// 			this.remove(ownerId, varName)
// 		})
// 	}

// 	toObject() {
// 		return {
// 			defs: { ...this.state.defs },
// 			values: { ...this.state.values },
// 			varNamesByOwnerId: { ...this.state.varNamesByOwnerId }
// 		}
// 	}
// }

// const variables = new Variables()

// window.__v = variables

// export default variables
