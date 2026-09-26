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

const getParsedRangeFromSingleValue = updated => {
	if (typeof updated === 'undefined' || updated === null) return null

	return {
		min: updated,
		isMinInclusive: true,
		max: updated,
		isMaxInclusive: true
	}
}

// replaceDict is an object of possibile replacements for `updated`.
// For example, if replaceDict = { '$highest_score':100 } and `updated` is '$highest_score' then
// `updated` will be replaced with 100.
// nonParsedValueOrValues is a updated or an array of values that won't be parsed by parseFloat.
// If `updated` is one of these values then `updated` is not parsed and simply returned.
// For example, if nonParsedValueOrValues is `[null, undefined]` and `updated` is null
// then null is returned.
const tryGetParsedFloat = (updated, replaceDict = {}, nonParsedValueOrValues = []) => {
	let nonParsedValues

	if (!(nonParsedValueOrValues instanceof Array)) {
		nonParsedValues = [nonParsedValueOrValues]
	} else {
		nonParsedValues = nonParsedValueOrValues
	}

	for (const placeholder in replaceDict) {
		if (updated === placeholder) {
			updated = replaceDict[placeholder]
			break
		}
	}

	// If the updated is an allowed non-numeric updated then we don't parse it
	// and simply return it as is
	if (nonParsedValues.indexOf(updated) > -1) return updated

	const parsedValue = parseFloat(updated)

	if (!Number.isFinite(parsedValue) && parsedValue !== Infinity && parsedValue !== -Infinity) {
		throw new Error(`Unable to parse "${updated}": Got "${parsedValue}" - Unsure how to proceed`)
	}

	return parsedValue
}

const isValueInRange = (updated, range, replaceDict) => {
	// By definition a updated is not inside a null range
	if (range === null) return false

	let isMinRequirementMet, isMaxRequirementMet

	const min = tryGetParsedFloat(range.min, replaceDict)
	const max = tryGetParsedFloat(range.max, replaceDict)

	if (range.isMinInclusive) {
		isMinRequirementMet = updated >= min
	} else {
		isMinRequirementMet = updated > min
	}

	if (range.isMaxInclusive) {
		isMaxRequirementMet = updated <= max
	} else {
		isMaxRequirementMet = updated < max
	}

	return isMinRequirementMet && isMaxRequirementMet
}

module.exports = {
	getParsedRange,
	getParsedRangeFromSingleValue,
	tryGetParsedFloat,
	isValueInRange
}
