/*

* = Optional

Expected input for type 'attempt':
{
	type: 'attempt',
	*mods: Array<Mod> (Default = [])
}

Expected input for type 'pass-fail':
{
	type: 'pass-file',
	*passingAttemptScore: 0-100 [Default = 100],
	*passedResult: (0-100 | '$attempt_score') [Default = 100],
	*failedResult: (0-100 | 'no-score' | '$highest_attempt_score' ) [Default = 0],
	*unableToPassResult: (0-100 | 'no-score' | '$attempt_score' | '$highest_attempt_score' | null) [Default = null],
	*mods: Array<Mod> (Default = [])
}

Mod:

{
	attemptCondition: (Number | AttemptRange) [Default = '[1-$last_attempt]'],
	reward: Number
}

AttemptRange:
	("[" | "(") + (>=1 | '$last_attempt') + "," + (>=1 | '$last_attempt') + ("]" | ")")

(Mods are only applied if PASSING. Mods must contain at least one condition)

*/

let MOD_AMOUNT_LIMIT = 20

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

let getRangeString = range => {
	if (range.min === range.max && range.isMinInclusive && range.isMaxInclusive) {
		return '' + range.min
	}

	let lhs = range.isMinInclusive ? '[' : '('
	let rhs = range.isMaxInclusive ? ']' : ')'

	return lhs + range.min + ',' + range.max + rhs
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

let getRubricType = rubric =>
	!rubric || !rubric.type ? AssessmentRubric.TYPE_ATTEMPT : rubric.type

let createWhitelistedRubric = rubric => {
	let rubricType = getRubricType(rubric)

	let whitelistedRubric

	switch (rubricType) {
		case AssessmentRubric.TYPE_PASS_FAIL:
			whitelistedRubric = Object.assign(
				{
					passingAttemptScore: 100,
					passedResult: 100,
					failedResult: 0,
					unableToPassResult: null
				},
				rubric
			)
			break

		case AssessmentRubric.TYPE_ATTEMPT:
		default:
			whitelistedRubric = {
				passingAttemptScore: 0,
				passedResult: AssessmentRubric.VAR_ATTEMPT_SCORE,
				failedResult: 0,
				unableToPassResult: null
			}
			break
	}

	return whitelistedRubric
}

let createWhitelistedMod = mod => {
	let parsedReward

	// Ensure at least one condition exists:
	if (!mod.attemptCondition) {
		return null
	}

	mod = Object.assign(
		{
			attemptCondition: '[0,$last_attempt]'
			// dateCondition: null,
		},
		mod
	)

	return {
		attemptCondition: getParsedRange(mod.attemptCondition.toString()),
		reward: mod.reward
	}
}

let modToObject = whitelistedMod => {
	return {
		attemptCondition: getRangeString(whitelistedMod.attemptCondition),
		reward: whitelistedMod.reward
	}
}

class AssessmentRubric {
	constructor(rubric) {
		this.originalRubric = Object.assign(rubric || {})

		let mods = rubric && rubric.mods ? rubric.mods.slice(0, MOD_AMOUNT_LIMIT) : []

		this.rubric = createWhitelistedRubric(rubric)
		this.type = getRubricType(rubric)
		this.mods = mods.map(createWhitelistedMod).filter(mod => mod !== null)
	}

	toObject() {
		return {
			type: this.type,
			passingAttemptScore: this.rubric.passingAttemptScore,
			passedResult: this.rubric.passedResult,
			failedResult: this.rubric.failedResult,
			unableToPassResult: this.rubric.unableToPassResult,
			mods: this.mods.map(modToObject)
		}
	}

	clone() {
		return new AssessmentRubric(this.originalRubric)
	}

	getAssessmentScoreInfoForAttempt(totalNumberOfAttemptsAvailable, attemptScores) {
		if (attemptScores.length === 0) return null

		let highestAttemptScore = Math.max.apply(null, attemptScores)
		let highestAttemptNumber =
			attemptScores.reduce((iMax, x, i, arr) => (x >= arr[iMax] ? i : iMax), 0) + 1
		let latestAttemptScore = attemptScores[attemptScores.length - 1]
		let attemptNumber = attemptScores.length
		let isLastAttempt = attemptNumber === totalNumberOfAttemptsAvailable

		let rewardedMods = []
		let rewardedModsIndicies = []
		let rewardTotal = 0
		let assessmentScore
		let status
		let attemptScore

		let attemptReplaceDict = {}
		attemptReplaceDict[AssessmentRubric.VAR_LAST_ATTEMPT] = totalNumberOfAttemptsAvailable

		let scoreReplaceDict = {}

		if (latestAttemptScore >= this.rubric.passingAttemptScore) {
			status = AssessmentRubric.STATUS_PASSED
		} else if (
			isLastAttempt &&
			this.rubric.unableToPassResult !== null &&
			highestAttemptScore < this.rubric.passingAttemptScore
		) {
			status = AssessmentRubric.STATUS_UNABLE_TO_PASS
		} else {
			status = AssessmentRubric.STATUS_FAILED
		}

		switch (status) {
			case AssessmentRubric.STATUS_UNABLE_TO_PASS:
				scoreReplaceDict[AssessmentRubric.VAR_HIGHEST_ATTEMPT_SCORE] = highestAttemptScore
				scoreReplaceDict[AssessmentRubric.NO_SCORE] = null

				if (this.rubric.unableToPassResult === AssessmentRubric.VAR_HIGHEST_ATTEMPT_SCORE) {
					attemptNumber = highestAttemptNumber
					attemptScore = highestAttemptScore
				} else {
					attemptScore = latestAttemptScore
				}
				assessmentScore = tryGetParsedFloat(this.rubric.unableToPassResult, scoreReplaceDict, true)

				break

			case AssessmentRubric.STATUS_FAILED:
				scoreReplaceDict[AssessmentRubric.NO_SCORE] = null

				attemptScore = latestAttemptScore
				assessmentScore = tryGetParsedFloat(this.rubric.failedResult, scoreReplaceDict, true)
				break

			case AssessmentRubric.STATUS_PASSED:
				scoreReplaceDict[AssessmentRubric.VAR_ATTEMPT_SCORE] = latestAttemptScore

				attemptScore = latestAttemptScore
				assessmentScore = tryGetParsedFloat(this.rubric.passedResult, scoreReplaceDict, true)

				// find matching mods and apply them
				this.mods.forEach((mod, i) => {
					if (isValueInRange(attemptNumber, mod.attemptCondition, attemptReplaceDict)) {
						rewardedMods.push(mod)
						rewardedModsIndicies.push(i)
					}
				})

				rewardTotal = rewardedMods.reduce((acc, mod) => acc + tryGetParsedFloat(mod.reward), 0)
				break
		}

		return {
			attemptNumber,
			attemptScore,
			assessmentScore,
			rewardedMods: rewardedModsIndicies,
			rewardTotal,
			assessmentModdedScore:
				assessmentScore === null ? null : Math.min(100, Math.max(0, assessmentScore + rewardTotal)),
			status
		}
	}
}

AssessmentRubric.TYPE_ATTEMPT = 'attempt'
AssessmentRubric.TYPE_PASS_FAIL = 'pass-fail'

AssessmentRubric.STATUS_PASSED = 'passed'
AssessmentRubric.STATUS_FAILED = 'failed'
AssessmentRubric.STATUS_UNABLE_TO_PASS = 'unableToPass'

AssessmentRubric.VAR_HIGHEST_ATTEMPT_SCORE = '$highest_attempt_score'
AssessmentRubric.VAR_ATTEMPT_SCORE = '$attempt_score'
AssessmentRubric.VAR_LAST_ATTEMPT = '$last_attempt'

AssessmentRubric.NO_SCORE = 'no-score'
// AssessmentRubric.VAR_CLOSE_DATE = '$close_date'

module.exports = AssessmentRubric
