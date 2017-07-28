const GLOBAL_VARIABLE_NAME = '__oboGlobals'

module.exports = class OboGlobals {
	constructor() {
		this.entries = {}
	}

	set(key, value) {
		if (typeof value === 'string' || value instanceof String) {
			this.entries[key] = '"' + value + '"'
			return true
		}

		if (
			typeof value === 'number' ||
			value instanceof Number ||
			typeof value === 'boolean' ||
			value instanceof Boolean
		) {
			this.entries[key] = value
			return true
		}

		if (typeof value === 'object') {
			this.entries[key] = JSON.stringify(value)
			return true
		}

		return false
	}

	renderScriptContent() {
		let output =
			'if(!window["' + GLOBAL_VARIABLE_NAME + '"]) window["' + GLOBAL_VARIABLE_NAME + '"] = {};\n'
		for (let key in this.entries) {
			output += 'window["' + GLOBAL_VARIABLE_NAME + '"]["' + key + '"]=' + this.entries[key] + ';\n'
		}

		return output
	}
}
