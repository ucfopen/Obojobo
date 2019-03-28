const getParsedRange = range => {
	if (typeof range === 'undefined' || range === null) return null

	if (range.indexOf(',') === -1) return getParsedRangeFromSingleValue(range)

	const ints = range.replace(/[([)\] ]+/g, '')
	const rangeValues = ints.split(',')

	return {
		min: rangeValues[0],
		isMinInclusive: range.charAt(0) === '[',
		max: rangeValues[1],
		isMaxInclusive: range.charAt(range.length - 1) === ']'
	}
}

const getParsedRangeFromSingleValue = value => {
	if (typeof value === 'undefined' || value === null) return null

	return {
		min: value,
		isMinInclusive: true,
		max: value,
		isMaxInclusive: true
	}
}

// replaceDict is an object of possibile replacements for `value`.
// For example, if replaceDict = { '$highest_score':100 } and `value` is '$highest_score' then
// `value` will be replaced with 100.
// nonParsedValueOrValues is a value or an array of values that won't be parsed by parseFloat.
// If `value` is one of these values then `value` is not parsed and simply returned.
// For example, if nonParsedValueOrValues is `[null, undefined]` and `value` is null
// then null is returned.
const tryGetParsedFloat = (value, replaceDict = {}, nonParsedValueOrValues = []) => {
	let nonParsedValues

	if (!(nonParsedValueOrValues instanceof Array)) {
		nonParsedValues = [nonParsedValueOrValues]
	} else {
		nonParsedValues = nonParsedValueOrValues
	}

	for (const placeholder in replaceDict) {
		if (value === placeholder) {
			value = replaceDict[placeholder]
			break
		}
	}

	// If the value is an allowed non-numeric value then we don't parse it
	// and simply return it as is
	if (nonParsedValues.indexOf(value) > -1) return value

	const parsedValue = parseFloat(value)

	if (!Number.isFinite(parsedValue) && parsedValue !== Infinity && parsedValue !== -Infinity) {
		throw new Error(`Unable to parse "${value}": Got "${parsedValue}" - Unsure how to proceed`)
	}

	return parsedValue
}

const isValueInRange = (value, range, replaceDict) => {
	// By definition a value is not inside a null range
	if (range === null) return false

	let isMinRequirementMet, isMaxRequirementMet

	const min = tryGetParsedFloat(range.min, replaceDict)
	const max = tryGetParsedFloat(range.max, replaceDict)

	if (range.isMinInclusive) {
		isMinRequirementMet = value >= min
	} else {
		isMinRequirementMet = value > min
	}

	if (range.isMaxInclusive) {
		isMaxRequirementMet = value <= max
	} else {
		isMaxRequirementMet = value < max
	}

	return isMinRequirementMet && isMaxRequirementMet
}

module.exports = {
	getParsedRange,
	getParsedRangeFromSingleValue,
	tryGetParsedFloat,
	isValueInRange
}
