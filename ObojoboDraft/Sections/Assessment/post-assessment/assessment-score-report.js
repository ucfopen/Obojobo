let getDisplayFriendlyScore = n => {
	if (n === null) return '--'
	return n.toFixed(2).replace('.00', '')
}

let getPassingRange = passingNumber => {
	if (passingNumber === 100) return '100%'
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
		return 'Passed on attempt ' + range[0]
	}

	return 'Passed on attempts ' + range[0] + ' to ' + range[1]
}

export default class AssessmentScoreReport {
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
		let status = assessmentScoreInfo.status
		let attemptNum = assessmentScoreInfo.attemptNumber

		let items = []
		let attemptScore = getDisplayFriendlyScore(assessmentScoreInfo.attemptScore)
		let assessScore = getDisplayFriendlyScore(assessmentScoreInfo.assessmentModdedScore)

		if (rubric.type === 'attempt' && isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Attempt ' + attemptNum + ' score',
				value: attemptScore
			})
		} else if (rubric.type === 'attempt' && !isRewardedMods) {
			items.push({
				type: 'line',
				text: 'This is your highest attempt score (Attempt ' + attemptNum + ')'
			})
			//
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'passed' &&
			passedResult === '$attempt_score' &&
			isRewardedMods
		) {
			items.push({
				type: 'value',
				text: 'Passing attempt ' + attemptNum + ' score',
				value: attemptScore
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'passed' &&
			passedResult === '$attempt_score' &&
			!isRewardedMods
		) {
			items.push({
				type: 'line',
				text: 'This is your highest passing attempt ' + attemptNum + ' score'
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'passed' &&
			Number.isFinite(parseFloat(passedResult)) &&
			isRewardedMods
		) {
			items.push({
				type: 'value',
				text: 'Reward for your passing attempt ' + attemptNum + ' score',
				value: getDisplayFriendlyScore(passedResult)
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'passed' &&
			Number.isFinite(parseFloat(passedResult)) &&
			!isRewardedMods
		) {
			items.push({
				type: 'line',
				text: 'This is your rewarded score for your passing attempt ' + attemptNum + ' score'
			})
		} else if (rubric.type === 'pass-fail' && status === 'failed' && failedResult === 'no-score') {
			items.push({
				type: 'line',
				text: 'You need an attempt score of ' + getPassingRange(passingAttemptScore) + ' to pass'
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'failed' &&
			Number.isFinite(parseFloat(failedResult))
		) {
			items.push({
				type: 'value',
				text:
					'Given score for a non-passing (less than ' +
					getDisplayFriendlyScore(passingAttemptScore) +
					'%) attempt',
				value: getDisplayFriendlyScore(failedResult)
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'unableToPass' &&
			unableToPassResult === 'no-score'
		) {
			items.push({
				type: 'line',
				text: 'You needed an attempt score of ' + getPassingRange(passingAttemptScore) + ' to pass'
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'unableToPass' &&
			unableToPassResult === '$highest_attempt_score'
		) {
			items.push({
				type: 'line',
				text: 'This is your highest attempt score (Attempt ' + attemptNum + ')'
			})
		} else if (
			rubric.type === 'pass-fail' &&
			status === 'unableToPass' &&
			Number.isFinite(parseFloat(unableToPassResult))
		) {
			items.push({
				type: 'value',
				text:
					'Given score for not achieving a passing (' +
					getPassingRange(passingAttemptScore) +
					') attempt',
				value: getDisplayFriendlyScore(unableToPassResult)
			})
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

			let isScoreOver100 = assessmentScoreInfo.attemptScore + assessmentScoreInfo.rewardTotal > 100

			items.push({
				type: 'total',
				text: 'Total' + (isScoreOver100 ? ' (Max 100%)' : ''),
				value: assessScore
			})
		}

		return items
	}
}
