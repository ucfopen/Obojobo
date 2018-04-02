let getDisplayFriendlyScore = n => {
	if (n === null) return '--'
	return parseFloat(n)
		.toFixed(2)
		.replace('.00', '')
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
		return 'Passed on attempt\u00a0' + range[0]
	}

	return 'Passed on attempts ' + range[0] + ' to ' + range[1]
}

export default class AssessmentScoreReport {
	constructor(assessmentRubric) {
		this.assessmentRubric = assessmentRubric
	}

	getTextItems(isHighest, assessmentScoreInfo, numOfAttemptsAvailable) {
		let rubric = this.assessmentRubric

		let passingAttemptScore =
			typeof rubric.passingAttemptScore !== 'undefined' ? rubric.passingAttemptScore : 100
		let passedResult = typeof rubric.passedResult !== 'undefined' ? rubric.passedResult : 100
		let failedResult = typeof rubric.failedResult !== 'undefined' ? rubric.failedResult : 0
		let unableToPassResult =
			typeof rubric.unableToPassResult !== 'undefined' ? rubric.unableToPassResult : 0
		let isRewardedMods = assessmentScoreInfo.rewardedMods.length > 0
		let isTypeAttempt = rubric.type === 'attempt'
		let isTypePassFail = rubric.type === 'pass-fail'
		let status = assessmentScoreInfo.status
		let passed = status === 'passed'
		let failed = status === 'failed'
		let unableToPass = status === 'unableToPass'
		let attemptNum = assessmentScoreInfo.attemptNumber

		let items = []
		let attemptScore = getDisplayFriendlyScore(assessmentScoreInfo.attemptScore)
		let assessScore = getDisplayFriendlyScore(assessmentScoreInfo.assessmentModdedScore)

		if (isTypeAttempt && isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Attempt\u00a0' + attemptNum + ' score',
				value: attemptScore
			})
		} else if (isTypeAttempt && !isRewardedMods && isHighest) {
			items.push({
				type: 'line',
				text: 'This is your highest attempt score (Attempt\u00a0' + attemptNum + ')'
			})
		} else if (isTypeAttempt && !isRewardedMods && !isHighest) {
			items.push({
				type: 'line',
				text: 'This is your attempt\u00a0' + attemptNum + ' score'
			})
		} else if (isTypePassFail && passed && passedResult === '$attempt_score' && isRewardedMods) {
			items.push({
				type: 'value',
				text: 'Passing attempt\u00a0' + attemptNum + ' score',
				value: attemptScore
			})
		} else if (
			isTypePassFail &&
			passed &&
			passedResult === '$attempt_score' &&
			!isRewardedMods &&
			isHighest
		) {
			items.push({
				type: 'line',
				text: 'This is your highest passing attempt\u00a0' + attemptNum + ' score'
			})
		} else if (
			isTypePassFail &&
			passed &&
			passedResult === '$attempt_score' &&
			!isRewardedMods &&
			!isHighest
		) {
			items.push({
				type: 'line',
				text: 'This is your passing attempt\u00a0' + attemptNum + ' score'
			})
		} else if (
			isTypePassFail &&
			passed &&
			Number.isFinite(parseFloat(passedResult)) &&
			isRewardedMods
		) {
			items.push({
				type: 'value',
				text: 'Reward for your passing attempt\u00a0' + attemptNum + ' score',
				value: getDisplayFriendlyScore(passedResult)
			})
		} else if (
			isTypePassFail &&
			passed &&
			Number.isFinite(parseFloat(passedResult)) &&
			!isRewardedMods
		) {
			items.push({
				type: 'line',
				text: 'This is your rewarded score for your passing attempt\u00a0' + attemptNum + ' score'
			})
		} else if (isTypePassFail && failed && failedResult === 'no-score') {
			items.push({
				type: 'line',
				text: 'You need an attempt score of ' + getPassingRange(passingAttemptScore) + ' to pass'
			})
		} else if (isTypePassFail && failed && Number.isFinite(parseFloat(failedResult))) {
			items.push({
				type: 'value',
				text:
					'Given score for a non-passing (less than ' +
					getDisplayFriendlyScore(passingAttemptScore) +
					'%) attempt',
				value: getDisplayFriendlyScore(failedResult)
			})
		} else if (isTypePassFail && unableToPass && unableToPassResult === 'no-score') {
			items.push({
				type: 'line',
				text: 'You needed an attempt score of ' + getPassingRange(passingAttemptScore) + ' to pass'
			})
		} else if (isTypePassFail && unableToPass && unableToPassResult === '$highest_attempt_score') {
			items.push({
				type: 'line',
				text: 'This is your highest attempt score (Attempt\u00a0' + attemptNum + ')'
			})
		} else if (isTypePassFail && unableToPass && Number.isFinite(parseFloat(unableToPassResult))) {
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
