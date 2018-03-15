let parseRubric = (el) => {
	let mods = []
	if(el.elements && el.elements[0] && el.elements[0].name === 'mods')
	{
		mods = el.elements[0].value.map(child => parseMod(child))
	}

	return {
		type: el.attributes.type,
		passingAttemptScore: el.attributes.passingAttemptScore,
		passedResult: el.attributes.passedResult,
		failedResult: el.attributes.failedResult,
		unableToPassResult: el.attributes.unableToPassResult,
		mods
	}
}

let parseMod = (el) => {
	return {
		attemptCondition: el.attributes.attemptCondition,
		reward: el.attributes.reward
	}
}

module.exports = parseRubric;