let { ACTOR_USER } = require('./caliper_constants')

let caliperEventRequirements = {
	required: ['actor'],
	optional: ['isPreviewMode', 'extensions', 'sessionIds']
}

// @TODO decouple caliper specifics
let validateArguments = (
	{ required, optional = [] },
	params,
	actorType,
	includedRequirements = caliperEventRequirements
) => {
	if (includedRequirements) {
		required = [...required, ...includedRequirements.required]
		optional = [...optional, ...includedRequirements.optional]
	}
	let invalidKeys = []
	let missingRequired = []
	let invalidActor = []

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
	if (invalidActor.length)
		errorString += `Invalid actor type. Must provide actor of type ${invalidActor.join()}\n`
	if (invalidKeys.length) errorString += `Invalid arguments: ${invalidKeys.join()}\n`
	if (missingRequired.length) errorString += `Missing required arguments: ${missingRequired.join()}`
	if (errorString) throw `${errorString}`
}

let assignOptions = obj => {
	if (obj.isPreviewMode == null) obj.isPreviewMode = false
	let options = { isPreviewMode: obj.isPreviewMode }

	if (obj.sessionIds) {
		let required = ['sessionId', 'launchId']
		validateArguments({ required }, obj.sessionIds, null, null)
		return Object.assign(options, {
			sessionId: obj.sessionIds.sessionId,
			launchId: obj.sessionIds.launchId
		})
	} else return options
}

module.exports = { validateArguments, assignOptions }
