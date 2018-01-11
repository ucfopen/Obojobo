// <scoreConditions>
// 	<condition onAttempt="[1,2]" onHighestAttemptScore="(80,100]" setAssessmentScore="100" />
// </scoreConditions>

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

let tryGetParsedFloatAllowingNull = (value, replaceDict) => {
	if (value === null) return null
	return tryGetParsedFloat(value, replaceDict)
}

let tryGetParsedFloat = (value, replaceDict) => {
	for (let placeholder in replaceDict) {
		if (value === placeholder) {
			value = parseFloat(replaceDict[placeholder])
			break
		}
	}

	if (value === null) {
		return null
	}

	let parsedValue = parseFloat(value)

	if (!Number.isFinite(parsedValue))
		throw new Error(`Unable to parse "${value}": Got "${parsedValue}" - Unsure how to proceed`)

	return parsedValue
}

let isValueInRange = (value, range, replaceDict) => {
	// By default a null range is defined to be all-inclusive
	if (range === null) return true

	let isMinRequirementMet, isMaxRequirementMet

	let min = tryGetParsedFloat(range.min, replaceDict)
	let max = tryGetParsedFloat(range.max, replaceDict)

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

let getAssessmentScoreFromSubset = (
	conditions,
	totalNumberOfAttemptsAvailable,
	attemptScoresSlice
) => {
	let highestAttemptScore = Math.max.apply(null, attemptScoresSlice)

	let replaceDict = {}
	replaceDict[AssessmentScoreConditions.LAST_ATTEMPT] = totalNumberOfAttemptsAvailable
	replaceDict[AssessmentScoreConditions.HIGHEST_ATTEMPT_SCORE] = highestAttemptScore

	let conditionsMatchingAttemptNumber = conditions.filter(condition => {
		return isValueInRange(attemptScoresSlice.length, condition.attemptRange, replaceDict)
	})

	for (let condition of conditionsMatchingAttemptNumber) {
		if (isValueInRange(highestAttemptScore, condition.scoreRange, replaceDict)) {
			return tryGetParsedFloatAllowingNull(condition.scoreResult, replaceDict)
		}
	}

	return -1
}

let defaultConditionsOptions = [
	{
		setAssessmentScore: '$highestAttemptScore'
	}
]

//export default
class AssessmentScoreConditions {
	constructor(conditionsOptions = defaultConditionsOptions) {
		let parsedScoreRange, parsedAttemptRange

		this.conditions = []

		conditionsOptions.forEach(condition => {
			parsedScoreRange = getParsedRange(condition.onHighestAttemptScore)
			parsedAttemptRange = getParsedRange(condition.onAttempt)

			this.conditions.push({
				attemptRange: parsedAttemptRange,
				scoreRange: parsedScoreRange,
				scoreResult: condition.setAssessmentScore
			})
		})
	}

	getAssessmentScore(totalNumberOfAttemptsAvailable, attemptScores) {
		if (attemptScores.length === 0) return null

		let maxAssessmentScore = -1
		let curScore

		for (let i = 1, len = totalNumberOfAttemptsAvailable; i <= len; i++) {
			curScore = getAssessmentScoreFromSubset(
				this.conditions,
				totalNumberOfAttemptsAvailable,
				attemptScores.slice(0, i)
			)

			if (curScore !== null) {
				maxAssessmentScore = Math.max(maxAssessmentScore, curScore)
			}
		}

		return maxAssessmentScore === -1 ? null : maxAssessmentScore
	}
}

AssessmentScoreConditions.LAST_ATTEMPT = '$lastAttempt'
AssessmentScoreConditions.HIGHEST_ATTEMPT_SCORE = '$highestAttemptScore'

module.exports = AssessmentScoreConditions
