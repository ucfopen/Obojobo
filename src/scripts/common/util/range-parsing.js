let getParsedRange = range => {
	if (typeof range === 'undefined' || range === null) return null

	if (range.indexOf(',') === -1) return getParsedRangeFromSingleValue(range)

	let ints = range.replace(/[\(\[\)\] ]+/g, '')
	let rangeValues = ints.split(',')

	return {
		min: rangeValues[0],
		isMinInclusive: range.charAt(0) === '[',
		max: rangeValues[1],
		isMaxInclusive: range.charAt(range.length - 1) === ']'
	}
}

let getParsedRangeFromSingleValue = value => {
	if (typeof value === 'undefined' || value === null) return null

	return {
		min: value,
		isMinInclusive: true,
		max: value,
		isMaxInclusive: true
	}
}

let tryGetParsedFloat = (value, replaceDict = {}, allowNull = false) => {
	let replaceDictValue

	for (let placeholder in replaceDict) {
		if (value === placeholder) {
			replaceDictValue = replaceDict[placeholder]
			value = replaceDictValue === null ? null : parseFloat(replaceDictValue)
			break
		}
	}

	if (allowNull && value === null) {
		return null
	}

	let parsedValue = parseFloat(value)

	if (!Number.isFinite(parsedValue))
		throw new Error(`Unable to parse "${value}": Got "${parsedValue}" - Unsure how to proceed`)

	return parsedValue
}

let isValueInRange = (value, range, replaceDict, allowNull = false) => {
	// By default a null range is defined to be all-inclusive
	if (range === null) return true

	let isMinRequirementMet, isMaxRequirementMet

	let min = tryGetParsedFloat(range.min, replaceDict, allowNull)
	let max = tryGetParsedFloat(range.max, replaceDict, allowNull)

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
