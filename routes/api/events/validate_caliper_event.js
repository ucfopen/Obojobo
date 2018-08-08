const { ACTOR_USER } = require('./caliper_constants')

const caliperEventRequirements = {
	required: ['actor'],
	optional: ['extensions', 'sessionIds']
}

const validateArguments = (
	{ required, optional = [] },
	params,
	actorType,
	includedRequirements = caliperEventRequirements
) => {
	if (includedRequirements) {
		required = [...required, ...includedRequirements.required]
		optional = [...optional, ...includedRequirements.optional]
	}
	const invalidKeys = []
	const missingRequired = []
	const invalidActor = []

	Object.keys(params).forEach(key => {
		if (!required.includes(key) && !optional.includes(key)) {
			invalidKeys.push(key)
		}
	})

	required.forEach(key => {
		// Validate Actor Object
		if (key === 'actor' && params.actor) {
			if (!params.actor.type) missingRequired.push('actor.type')
			if (params.actor.type === ACTOR_USER && !params.actor.id) missingRequired.push('actor.id')
			if (actorType) {
				if (params.actor.type !== actorType) invalidActor.push(actorType)
			}
		}

		if (!params.hasOwnProperty(key)) {
			missingRequired.push(key)
		}
	})

	let errorString = ''
	if (invalidActor.length) {
		errorString += `Invalid actor type. Must provide actor of type ${invalidActor.join()}\n`
	}
	if (invalidKeys.length) errorString += `Invalid arguments: ${invalidKeys.join()}\n`
	if (missingRequired.length) errorString += `Missing required arguments: ${missingRequired.join()}`
	if (errorString) throw `${errorString}`
}

const assignOptions = obj => {
	if (!obj.sessionIds) return {}

	const required = ['sessionId', 'launchId']
	validateArguments({ required }, obj.sessionIds, null, null)
	return {
		sessionId: obj.sessionIds.sessionId,
		launchId: obj.sessionIds.launchId
	}
}

module.exports = { validateArguments, assignOptions }
