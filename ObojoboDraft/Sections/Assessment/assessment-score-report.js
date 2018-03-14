// let AssessmentRubric = require('./assessment-rubric');

// let rubric =
// let ar = new AssessmentRubric(rubric)

// let assessmentScoreInfo = ar.getAssessmentScoreInfoForLatestAttempt(10, [10])

// lang should be of type 'single' or 'multi'
// {"status": "passed", "rewardTotal": 0, "attemptScore": 0, "rewardedMods": [], "attemptNumber": 1, "assessmentScore": 0, "assessmentModdedScore": 0}
/*
{ attemptNumber: 1,
  attemptScore: 10,
  assessmentScore: 0,
  rewardedMods: [],
  rewardTotal: 0,
  assessmentModdedScore: 0,
  status: 'failed' }
*/

let getDisplayFriendlyScore = n => {
	if (n === null) return '--'
	return n.toFixed(2).replace('.00', '')
}

let getPassingRange = passingNumber => {
	if (passingNumber === 100) return '100%'
	return getDisplayFriendlyScore(passingNumber) + '-100%'
}

// '1st attempt'
// '1st to 2nd attempt'
// 'last attempt'
// '1st to 3rd attempt'
// '9th to last attempt'
let getModText = (attemptCondition, numOfAttemptsAvailable) => {
	// let info = {
	// 	isRange: null,
	// 	startsAtFirst: null,
	// 	endsAtLast: null
	// }

	attemptCondition = ('' + attemptCondition).replace('$last_attempt', '' + numOfAttemptsAvailable)

	let range = []
	if (attemptCondition.indexOf('-') === -1) {
		range.push(parseInt(attemptCondition, 10))
	} else {
		let tokens = attemptCondition.split('-')
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
		// switch(this.assessmentRubric.type)
		// {
		// 	case 'attempt':
		// }

		// if(assessmentScoreInfo.status === 'failed')
		// if(assessmentScoreInfo.rewardedMods.length === 0)
		// {

		// }
		let rubric = this.assessmentRubric

		let passingAttemptScore =
			typeof rubric.passingAttemptScore !== 'undefined' ? rubric.passingAttemptScore : 100
		let passedResult = typeof rubric.passedResult !== 'undefined' ? rubric.passedResult : 100
		let failedResult = typeof rubric.failedResult !== 'undefined' ? rubric.failedResult : 0
		let unableToPassResult =
			typeof rubric.unableToPassResult !== 'undefined' ? rubric.unableToPassResult : 0
		let modsRewarded = assessmentScoreInfo.rewardedMods.length > 0

		let items = []
		let attemptScore = getDisplayFriendlyScore(assessmentScoreInfo.attemptScore)
		let assessScore = getDisplayFriendlyScore(assessmentScoreInfo.assessmentModdedScore)

		// console.log('ASI.rM', assessmentScoreInfo)

		switch (rubric.type) {
			case 'attempt':
				if (modsRewarded) {
					items.push({
						type: 'value',
						text: 'Attempt ' + assessmentScoreInfo.attemptNumber + ' score',
						value: attemptScore
					})
				} else {
					items.push({
						type: 'line',
						text:
							'This is your highest attempt score (Attempt ' +
							assessmentScoreInfo.attemptNumber +
							')'
					})
				}
				break

			case 'pass-fail':
				switch (assessmentScoreInfo.status) {
					case 'passed':
						if (passedResult === '$attempt_score') {
							if (modsRewarded) {
								items.push({
									type: 'value',
									text:
										'Passing (' +
										getPassingRange(passingAttemptScore) +
										') attempt ' +
										assessmentScoreInfo.attemptNumber +
										' score',
									value: attemptScore
								})
							} else {
								items.push({
									type: 'line',
									text:
										'This is your highest passing (' +
										getPassingRange(passingAttemptScore) +
										') attempt ' +
										assessmentScoreInfo.attemptNumber +
										' score'
								})
							}
						} else {
							if (modsRewarded) {
								items.push({
									type: 'value',
									text:
										'Reward for your passing (' +
										getPassingRange(passingAttemptScore) +
										') attempt ' +
										assessmentScoreInfo.attemptNumber +
										' score',
									value: getDisplayFriendlyScore(passedResult)
								})
							} else {
								items.push({
									type: 'line',
									text:
										'This is your rewarded score for your passing (' +
										getPassingRange(passingAttemptScore) +
										') attempt ' +
										assessmentScoreInfo.attemptNumber +
										' score'
								})
							}
						}
						break

					case 'failed':
						if (failedResult === 'no-score') {
							items.push({
								type: 'line',
								text:
									'You need an attempt score of ' +
									getPassingRange(passingAttemptScore) +
									' to pass'
							})
						} else {
							items.push({
								type: 'value',
								text:
									'Given score for a non-passing (less than ' +
									getDisplayFriendlyScore(passingAttemptScore) +
									'%) attempt',
								value: getDisplayFriendlyScore(failedResult)
							})
						}
						break

					case 'unableToPass':
						if (unableToPassResult === 'no-score') {
							items.push({
								type: 'line',
								text:
									'You needed an attempt score of ' +
									getPassingRange(passingAttemptScore) +
									' to pass'
							})
						} else if (unableToPassResult === '$highest_attempt_score') {
							items.push({
								type: 'line',
								text:
									'This is your highest attempt score (Attempt ' +
									assessmentScoreInfo.attemptNumber +
									')'
							})
						} else {
							items.push({
								type: 'value',
								text:
									'Given score for not achieving a passing (' +
									getPassingRange(passingAttemptScore) +
									') attempt',
								value: getDisplayFriendlyScore(unableToPassResult)
							})
						}
						break
				}
				break
		}

		if (assessmentScoreInfo.rewardedMods.length > 0) {
			items = items.concat(
				assessmentScoreInfo.rewardedMods.map(modIndex => {
					let mod = rubric.mods[modIndex]

					// Passed on first attempt
					// Passed on last attempt
					// Passed on attempts 1-2

					//@TODO - for now assumes attemptCondition - will change to type
					console.log('mod be all', mod)

					return {
						type: parseInt(mod.reward) >= 0 ? 'extra-credit' : 'penalty',
						text: getModText(mod.attemptCondition, numOfAttemptsAvailable),
						value: getDisplayFriendlyScore(Math.abs(mod.reward))
					}
				})
			)

			items.push({
				type: 'total',
				text:
					'Total' +
					(assessmentScoreInfo.attemptScore + assessmentScoreInfo.rewardTotal > 100
						? ' (Max 100%)'
						: ''), //@TODO
				value: assessScore
			})
		}

		return items
	}
}
