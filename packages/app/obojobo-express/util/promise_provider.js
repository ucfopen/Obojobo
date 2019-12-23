// possible npm packages to use instead:
// emittery
// p-event
const logger = oboRequire('logger')
const promiseProviders = {}

// Register promise to an event
// your provider mus be an async function or Promise
const registerPromiseProvider = (eventName, provider) => {
	if (!promiseProviders[eventName]) promiseProviders[eventName] = new Set()
	const providersForType = promiseProviders[eventName]
	providersForType.add(provider)
}

// execute all promises for an eventName in order with the provided arugments
// setting returnOnFirstNonNullResponse to true will return immediately
// when a promise returns a non-null value, skipping the remaining items
// always returns an array
const callPromiseProviders = async (
	eventName,
	providerArgs,
	returnOnFirstNonNullResponse = false
) => {
	if (!promiseProviders[eventName]) return []

	const providersForType = promiseProviders[eventName]

	const results = []
	for (const provider of providersForType) {
		try {
			const result = await provider(eventName, providerArgs)
			results.push(result)
			if (result && returnOnFirstNonNullResponse) break
		} catch (error) {
			logger.error(`Error calling promise provider for ${eventName}:`)
			logger.error(error)
		}
	}
	return results
}

module.exports = {
	callPromiseProviders,
	registerPromiseProvider
}
