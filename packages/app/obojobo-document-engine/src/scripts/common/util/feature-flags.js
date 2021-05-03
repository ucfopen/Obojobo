const LOCAL_STORAGE_FLAGS_KEY = 'obojobo:flags'

const writeFlagsToLocalStorage = flags => {
	try {
		const string = JSON.stringify(flags)
		window.localStorage[LOCAL_STORAGE_FLAGS_KEY] = string

		return true
	} catch (e) {
		console.error('Unable to save feature flags: ' + e)
		delete window.localStorage[LOCAL_STORAGE_FLAGS_KEY]

		return false
	}
}

const getFlagsFromLocalStorage = () => {
	try {
		const localStorageFlags = window.localStorage[LOCAL_STORAGE_FLAGS_KEY]

		if (typeof localStorageFlags !== 'undefined') {
			return JSON.parse(localStorageFlags)
		}
	} catch (e) {
		console.error('Unable to parse feature flags: ' + e)
		delete window.localStorage[LOCAL_STORAGE_FLAGS_KEY]
	}

	return {}
}

let flags = {}

class FeatureFlags {
	constructor() {
		flags = getFlagsFromLocalStorage()
	}

	set(flagName, flagValue) {
		const newFlags = { ...flags, [flagName]: '' + flagValue }

		if (writeFlagsToLocalStorage(newFlags)) {
			flags = newFlags
			return true
		}

		flags = {}
		return false
	}

	get(flagName) {
		const value = flags[flagName]

		if (typeof value === 'undefined') {
			return null
		}

		return value
	}

	is(flagName, value) {
		return this.get(flagName) === '' + value
	}

	list() {
		return { ...flags }
	}

	clear(flagName) {
		const newFlags = { ...flags }
		delete newFlags[flagName]

		if (writeFlagsToLocalStorage(newFlags)) {
			flags = newFlags
			return true
		}

		flags = {}
		return false
	}

	clearAll() {
		flags = {}
		delete window.localStorage[LOCAL_STORAGE_FLAGS_KEY]

		return true
	}
}

const featureFlags = new FeatureFlags()

featureFlags.ENABLED = 'enabled'

export default featureFlags
