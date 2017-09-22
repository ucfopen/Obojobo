let GLOBAL_KEY = '__oboGlobals'
let globals = new Map()

export default {
	get(key, defaultValue) {
		// If we have stored the value return it right away
		if (globals.has(key)) return globals.get(key)

		if (typeof window[GLOBAL_KEY][key] !== 'undefined') {
			// Set the value from window if we can find the value on window
			globals.set(key, window[GLOBAL_KEY][key])

			// Remove from window so this class becomes the single source of truth
			// (and prevent tampering with the value):
			delete window[GLOBAL_KEY][key]
		} else if (typeof defaultValue !== 'undefined') {
			// else set the value from the optional defaultValue argument (if defined)
			globals.set(key, defaultValue)
		}

		if (!globals.has(key)) throw 'No Obo Global found for key ' + key

		return globals.get(key)
	}
}
