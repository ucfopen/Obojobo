const parseVars = el => {
	// console.log('yo', el)
	const vars = el.elements.map(child => parseVariable(child))

	// console.log('vars', JSON.stringify(vars, null, 2))

	return vars

	// return {
	// 	type: el.attributes.type,
	// 	passingAttemptScore: el.attributes.passingAttemptScore,
	// 	passedResult: el.attributes.passedResult,
	// 	failedResult: el.attributes.failedResult,
	// 	unableToPassResult: el.attributes.unableToPassResult,
	// 	mods
	// }
}

const parseVariable = el => {
	// console.log('el --> ', JSON.stringify(el, null, 2))
	// console.log(el.value)

	switch (el.name) {
		case 'v':
			return parseV(el)

		case 'vgroup':
			return parseVGroup(el)
	}
}

const parseV = el => {
	if (el.value) {
		return {
			name: el.attributes.name,
			definition: el.value[0].text

			// definitions: el.value
		}
	} else {
		const name = el.attributes.name
		delete el.attributes.name

		return {
			name,
			definition: el.attributes
		}
	}
}

const parseVGroup = el => {
	// console.log('pvs', el.value)
	return el.value.map(v => v.value)
}

module.exports = parseVars
