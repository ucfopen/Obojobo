let getDisplayFriendlyScore = n => {
	if (n === null) return '--'
	return parseFloat(n)
		.toFixed(2)
		.replace('.00', '')
}

let getPassingRange = passingNumber => {
	if (passingNumber === 100 || passingNumber === '100') return '100%'
	return getDisplayFriendlyScore(passingNumber) + '-100%'
}

let getModText = (attemptCondition, numOfAttemptsAvailable) => {
	attemptCondition = ('' + attemptCondition).replace('$last_attempt', '' + numOfAttemptsAvailable)

	let range = []
	if (attemptCondition.indexOf(',') === -1) {
		range.push(parseInt(attemptCondition, 10))
	} else {
		let tokens = attemptCondition.split(',')
		range.push(parseInt(tokens[0].substr(1), 10))
		range.push(parseInt(tokens[1].substr(0, tokens[1].length - 1), 10))

		if (tokens[0].charAt(0) === '(') range[0]++
		if (tokens[1].charAt(tokens[1].length - 1) === ')') range[1]--

		if (range[0] === range[1]) range.splice(1, 1)
	}

	if (range.length === 1) {
		if (range[0] === 1) return 'Passed on first attempt'
		if (range[0] === numOfAttemptsAvailable) return 'Passed on last attempt'
		return 'Passed on attempt\u00a0' + range[0]
	}

	return 'Passed on attempts ' + range[0] + ' to ' + range[1]
}

class AssessmentScoreReport {
	constructor(assessmentRubric) {
		this.assessmentRubric = assessmentRubric
	}

	getTextItems(assessmentScoreInfo, numOfAttemptsAvailable) {
		let rubric = this.assessmentRubric

		let passingAttemptScore =
			typeof rubric.passingAttemptScore !== 'undefined' ? rubric.passingAttemptScore : 100
		let passedResult = typeof rubric.passedResult !== 'undefined' ? rubric.passedResult : 100
		let failedResult = typeof rubric.failedResult !== 'undefined' ? rubric.failedResult : 0
		let unableToPassResult =
			typeof rubric.unableToPassResult !== 'undefined' ? rubric.unableToPassResult : 0
		let isRewardedMods = assessmentScoreInfo.rewardedMods.length > 0
		let isAttemptRubric = rubric.type === 'attempt'
		let isPassFailRubric = rubric.type === 'pass-fail'
		let status = assessmentScoreInfo.status
		let passed = status === 'passed'
		let failed = status === 'failed'
		let unableToPass = status === 'unableToPass'
		// let isLTIAndScoreWasUnsent = (failed || unableToPass) && isLti
		let attemptNum = assessmentScoreInfo.attemptNumber

		let items = []
		let attemptScore = getDisplayFriendlyScore(assessmentScoreInfo.attemptScore)
		let assessScore = getDisplayFriendlyScore(assessmentScoreInfo.assessmentModdedScore)

		if (isAttemptRubric && !isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Score',
				value: attemptScore
			})
		} else if (isAttemptRubric && isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Base Score',
				value: attemptScore
			})
		} else if (isPassFailRubric && passed && passedResult === '$attempt_score' && !isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Score',
				value: attemptScore
			})
		} else if (isPassFailRubric && passed && passedResult === '$attempt_score' && isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Base Score',
				value: attemptScore
			})
		} else if (isPassFailRubric && passed && Number.isFinite(parseFloat(passedResult))) {
			items.push(
				{
					type: 'value',
					text: 'Base Score',
					value: attemptScore
				},
				{
					type: 'divider'
				},
				{
					type: 'value',
					text: 'Rewarded score for a passing attempt',
					value: getDisplayFriendlyScore(passedResult)
				}
			)
		} else if (isPassFailRubric && failed && failedResult === 'no-score') {
			items.push(
				{
					type: 'value',
					text: 'Base Score',
					value: attemptScore
				},
				{
					type: 'divider'
				},
				{
					type: 'text',
					text: 'You need ' + getPassingRange(passingAttemptScore) + ' to pass'
				}
			)
		} else if (isPassFailRubric && failed && Number.isFinite(parseFloat(failedResult))) {
			items.push(
				{
					type: 'value',
					text: 'Base Score',
					value: attemptScore
				},
				{
					type: 'divider'
				},
				{
					type: 'value',
					text:
						'Given score for a non-passing (less than ' +
						getDisplayFriendlyScore(passingAttemptScore) +
						'%) attempt',
					value: getDisplayFriendlyScore(failedResult)
				}
			)
		} else if (isPassFailRubric && unableToPass && unableToPassResult === 'no-score') {
			items.push(
				{
					type: 'value',
					text: 'Base Score',
					value: attemptScore
				},
				{
					type: 'divider'
				},
				{
					type: 'text',
					text: 'You needed ' + getPassingRange(passingAttemptScore) + ' to pass'
				}
			)
		} else if (
			isPassFailRubric &&
			unableToPass &&
			unableToPassResult === '$highest_attempt_score'
		) {
			items.push(
				{
					type: 'value',
					text: 'Base Score',
					value: attemptScore
				},
				{
					type: 'divider'
				},
				{
					type: 'text',
					text:
						'You did not achieve a passing ' +
						getPassingRange(passingAttemptScore) +
						' score within the number of attempts available. Your highest attempt score will be used instead.'
				},
				{
					type: 'divider'
				},
				{
					type: 'value',
					text: 'Highest attempt score (Attempt\u00a0' + attemptNum + ')',
					value: assessScore
				}
			)
		} else if (
			isPassFailRubric &&
			unableToPass &&
			Number.isFinite(parseFloat(unableToPassResult))
		) {
			items.push(
				{
					type: 'value',
					text: 'Base Score',
					value: attemptScore
				},
				{
					type: 'divider'
				},
				{
					type: 'text',
					text:
						'You did not achieve a passing ' +
						getPassingRange(passingAttemptScore) +
						' score within the number of attempts available.'
				},
				{
					type: 'value',
					text: 'Given score for not achieving a passing attempt',
					value: getDisplayFriendlyScore(unableToPassResult)
				}
			)
		} else {
			throw new Error('Unknown assessment rubric and score state')
		}

		if (assessmentScoreInfo.rewardedMods.length > 0) {
			items = items.concat(
				assessmentScoreInfo.rewardedMods.map(modIndex => {
					let mod = rubric.mods[modIndex]

					//@TODO - for now assumes attemptCondition - will change to type

					return {
						type: parseInt(mod.reward) >= 0 ? 'extra-credit' : 'penalty',
						text: getModText(mod.attemptCondition, numOfAttemptsAvailable),
						value: getDisplayFriendlyScore(Math.abs(mod.reward))
					}
				})
			)
		}

		if (items.length > 1) {
			let isScoreOver100 =
				assessmentScoreInfo.assessmentScore !== null &&
				assessmentScoreInfo.assessmentScore + assessmentScoreInfo.rewardTotal > 100

			items.push(
				{
					type: 'divider'
				},
				{
					type: 'total',
					text: 'Total Score' + (isScoreOver100 ? ' (Max 100%)' : ''),
					value:
						assessmentScoreInfo.assessmentModdedScore === null ? 'No Score Recorded' : assessScore
				}
			)
		}

		return items
	}
}

export default AssessmentScoreReport
