let parseRubric = (el) => {
	let mods = []
	if(el.elements && el.elements[0] && el.elements[0].name === 'mods')
	{
		mods = el.elements[0].value.map(child => parseMod(child))
	}

	return {
		type: el.attributes.type,
		passingAttemptScore: el.attributes.passingAttemptScore,
		passingResult: el.attributes.passingResult,
		failingResult: el.attributes.failingResult,
		failingLastAttemptResult: el.attributes.failingLastAttemptResult,
		mods
	}
	return (
		el.elements.map( (child) => { return child.value } )
	)
}

let parseMod = (el) => {
	return {
		attemptCondition: el.attributes.attemptCondition,
		passCondition: el.attributes.passCondition,
		scoreCondition: el.attributes.scoreCondition,
		reward: el.attributes.reward
	}
}

module.exports = parseRubric;