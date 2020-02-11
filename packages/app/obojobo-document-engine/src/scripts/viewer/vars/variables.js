import parse from './parser'

const getKey = (ownerId, varName) => {
	return `${ownerId}:${varName}`
}

class Variables {
	static fromObject(o) {
		this.defs = { ...o.defs }
		this.values = { ...o.values }
		this.varNamesByOwnerId = { ...o.varNamesByOwnerId }
	}

	constructor() {
		this.defs = {}
		this.values = {}
		this.varNamesByOwnerId = {}
	}

	getDefinition(ownerId, varName) {
		// console.log('getDefinition', ownerId, varName)
		const key = getKey(ownerId, varName)
		return this.hasDefinition(ownerId, varName) ? this.defs[key] : null
	}

	has(ownerId, varName) {
		const key = getKey(ownerId, varName)
		return typeof this.defs[key] !== 'undefined' || typeof this.values[key] !== 'undefined'
	}

	isComputableVariable(ownerId, varName) {
		return typeof this.getDefinition(ownerId, varName) === 'object'
	}

	isValueComputed(ownerId, varName) {
		return !this.isComputableVariable(ownerId, varName) || this.hasValue(ownerId, varName)
	}

	// Get value returns any computed values, but if none
	// exist then the definition is returned (for variables
	// which don't need to be computed)
	getValue(ownerId, varName) {
		// console.log('getValue', ownerId, varName)
		const key = getKey(ownerId, varName)
		if (varName === 'i') {
			console.log('**', this.values[key])
		}
		return this.values[key]
	}

	getOrSetValue(ownerId, varName, setFn) {
		// console.log('we checking if has value', ownerId, varName, this.hasValue(ownerId, varName))
		if (!this.hasValue(ownerId, varName)) {
			this.setValue(ownerId, varName, setFn(this.getDefinition(ownerId, varName)))
		}

		return this.getValue(ownerId, varName)
	}

	// special case, if varDefintion is not an object we take that as the value too
	add(ownerId, varName, varDefintionOrValue) {
		// console.log('add', ownerId, varName, varDefintionOrValue)
		if (typeof varDefintionOrValue !== 'object') {
			const value = varDefintionOrValue
			// this acts as the default:
			console.log('parsey', value)
			const parsedValue = parse(value)
			this.setDefinition(ownerId, varName, parsedValue)
			this.setValue(ownerId, varName, parsedValue)
		} else {
			const def = varDefintionOrValue
			this.setDefinition(ownerId, varName, def)
		}

		if (!this.varNamesByOwnerId[ownerId]) {
			this.varNamesByOwnerId[ownerId] = {}
		}
		this.varNamesByOwnerId[ownerId][varName] = true
	}

	addMultiple(ownerId, variableDefinitions = []) {
		// console.log('am', variableDefinitions)
		variableDefinitions.forEach(v => {
			this.add(ownerId, v.name, { ...v })
		})
	}

	setDefinition(ownerId, varName, definition) {
		const key = getKey(ownerId, varName)
		this.defs[key] = definition
	}

	setValue(ownerId, varName, value) {
		// if (!this.hasDefinition(ownerId, varName)) {
		// 	this.add(ownerId, varName, value)
		// } else {
		const key = getKey(ownerId, varName)
		// 	this.values[key] = value
		// }
		this.values[key] = value
	}

	hasDefinition(ownerId, varName) {
		const key = getKey(ownerId, varName)
		return typeof this.defs[key] !== 'undefined'
	}

	hasValue(ownerId, varName) {
		const key = getKey(ownerId, varName)
		return typeof this.values[key] !== 'undefined'
	}

	clearValue(ownerId, varName) {
		const key = getKey(ownerId, varName)

		if (this.isComputableVariable(ownerId, varName)) {
			delete this.values[key]
		} else {
			// reset to default
			this.setValue(ownerId, varName, this.getDefinition(ownerId, varName))
		}
	}

	clearAllValues(ownerId) {
		Object.keys(this.varNamesByOwnerId[ownerId]).forEach(varName => {
			this.clearValue(ownerId, varName)
		})
	}

	remove(ownerId, varName) {
		this.clearValue(ownerId, varName)
		const key = getKey(ownerId, varName)

		delete this.defs[key]
		delete this.varNamesByOwnerId[ownerId][varName]

		if (Object.keys(this.varNamesByOwnerId[ownerId]).length === 0) {
			delete this.varNamesByOwnerId[ownerId]
		}
	}

	removeAll(ownerId) {
		Object.keys(this.varNamesByOwnerId[ownerId]).forEach(varName => {
			this.remove(ownerId, varName)
		})
	}

	toObject() {
		return {
			defs: { ...this.defs },
			values: { ...this.values },
			varNamesByOwnerId: { ...this.varNamesByOwnerId }
		}
	}
}

const variables = new Variables()

window.__v = variables

export default variables
