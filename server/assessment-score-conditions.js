let getParsedRange = range => {
	if (typeof range === 'undefined' || range === null) return null

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

let getParsedValue = (value, replaceDict) => {
	// return parseFloat(value === replaceToken ? newValue : value)
	for (let placeholder in replaceDict) {
		if (value === placeholder) return parseFloat(replaceDict[placeholder])
	}

	return parseFloat(value)
}

let isValueInRange = (value, range, replaceDict) => {
	// By default a null range is defined to be all-inclusive
	if (range === null) return true

	let isMinRequirementMet, isMaxRequirementMet

	let min = getParsedValue(range.min, replaceDict)
	let max = getParsedValue(range.max, replaceDict)

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

let defaultConditionsOptions = [
	{
		scoreResult: '$highestAttemptScore'
	}
]

//export default
class AssessmentScoreConditions {
	constructor(conditionsOptions = defaultConditionsOptions) {
		let parsedScoreRange, parsedAttemptRange

		this.conditions = []

		conditionsOptions.forEach(condition => {
			parsedScoreRange = getParsedRange(condition.scoreRange)
			parsedAttemptRange = getParsedRange(condition.attemptRange)
			if (parsedAttemptRange === null) {
				parsedAttemptRange = getParsedRangeFromSingleValue(condition.attemptNumber)
			}

			this.conditions.push({
				attemptRange: parsedAttemptRange,
				scoreRange: parsedScoreRange,
				scoreResult: condition.scoreResult
			})
		})
	}

	// getAssessmentScore(attemptNumber, totalNumberOfAttempts, highestAttemptScore, thisAttemptScore)
	getAssessmentScore(totalNumberOfAttemptsAvailable, attemptScores) {
		let attemptScoresSlice
		let highestScore = -1

		for (
			let i = 1, len = Math.min(attemptScores.length, totalNumberOfAttemptsAvailable);
			i <= len;
			i++
		) {
			attemptScoresSlice = [].concat(attemptScores.slice(0, i))

			let replaceDict = {}
			let highestAttemptScore = Math.max(0, ...attemptScoresSlice)

			replaceDict[AssessmentScoreConditions.LAST_ATTEMPT] = totalNumberOfAttemptsAvailable
			replaceDict[AssessmentScoreConditions.HIGHEST_ATTEMPT_SCORE] = highestAttemptScore

			for (let condition of this.conditions) {
				if (
					isValueInRange(attemptScoresSlice.length, condition.attemptRange, replaceDict) &&
					isValueInRange(highestAttemptScore, condition.scoreRange, replaceDict)
				) {
					highestScore = Math.max(highestScore, getParsedValue(condition.scoreResult, replaceDict))
					break
				}
			}
		}

		if (highestScore === -1) return null
		return highestScore
	}
}

AssessmentScoreConditions.LAST_ATTEMPT = '$lastAttempt'
AssessmentScoreConditions.HIGHEST_ATTEMPT_SCORE = '$highestAttemptScore'

module.exports = AssessmentScoreConditions
