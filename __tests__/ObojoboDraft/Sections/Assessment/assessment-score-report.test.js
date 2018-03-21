import AssessmentScoreReport from '../../../../ObojoboDraft/Sections/Assessment/assessment-score-report'

describe('AssessmentScoreReport', () => {
	// beforeEach(() => {
	// 	jest.resetAllMocks()
	// })

	// type=attempt:

	test('type=attempt, no mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'attempt'
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 90,
					assessmentScore: 90,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 90,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your highest attempt score (Attempt 2)'
			}
		])
	})

	test('type=attempt, mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'attempt',
				mods: [
					{
						attemptCondition: 1,
						reward: 5
					}
				]
			}).getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 90,
					assessmentScore: 90,
					rewardedMods: [0],
					rewardTotal: 5,
					assessmentModdedScore: 95,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Attempt 1 score',
				value: '90'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				value: '5'
			},
			{
				type: 'total',
				text: 'Total',
				value: '95'
			}
		])
	})

	// type=pass-fail, status=passed, passedResult=$attempt_score:

	test('type=pass-fail, status=passed, passedResult=$attempt_score, passing=80-100%, no mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: '$attempt_score',
				failedResult: 0,
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 90,
					assessmentScore: 90,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 90,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your highest passing attempt 2 score'
			}
		])
	})

	test('type=pass-fail, status=passed, passedResult=$attempt_score, passing=80-100%, mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: '$attempt_score',
				failedResult: 0,
				unableToPassResult: 50,
				mods: [
					{
						attemptCondition: '[1,2]',
						reward: 5
					}
				]
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 90,
					assessmentScore: 90,
					rewardedMods: [0],
					rewardTotal: 5,
					assessmentModdedScore: 95,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Passing attempt 2 score',
				value: '90'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'total',
				text: 'Total',
				value: '95'
			}
		])
	})

	test('type=pass-fail, status=passed, passedResult=$attempt_score, passing=100%, no mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: '$attempt_score',
				failedResult: 0,
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 100,
					assessmentScore: 100,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your highest passing attempt 2 score'
			}
		])
	})

	test('type=pass-fail, status=passed, passedResult=$attempt_score, passing=100%, mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: '$attempt_score',
				failedResult: 0,
				unableToPassResult: 50,
				mods: [
					{
						attemptCondition: '[1,2]',
						reward: 5
					}
				]
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 100,
					assessmentScore: 100,
					rewardedMods: [0],
					rewardTotal: 5,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Passing attempt 2 score',
				value: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'total',
				text: 'Total (Max 100%)',
				value: '100'
			}
		])
	})

	// type=pass-fail, status=passed, passedResult=100:

	test('type=pass-fail, status=passed, passedResult=100, passing=80-100%, no mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 90,
					assessmentScore: 100,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your rewarded score for your passing attempt 2 score'
			}
		])
	})

	test('type=pass-fail, status=passed, passedResult=100, passing=80-100%, mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 50,
				mods: [
					{
						attemptCondition: '[1,2]',
						reward: 5
					}
				]
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 90,
					assessmentScore: 100,
					rewardedMods: [0],
					rewardTotal: 5,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Reward for your passing attempt 2 score',
				value: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'total',
				text: 'Total',
				value: '100'
			}
		])
	})

	test('type=pass-fail, status=passed, passedResult=100, passing=100%, no mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 100,
					assessmentScore: 100,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your rewarded score for your passing attempt 2 score'
			}
		])
	})

	test('type=pass-fail, status=passed, passedResult=100, passing=100%, mods rewarded', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 50,
				mods: [
					{
						attemptCondition: '[1,2]',
						reward: 5
					}
				]
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 100,
					assessmentScore: 100,
					rewardedMods: [0],
					rewardTotal: 5,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Reward for your passing attempt 2 score',
				value: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'total',
				text: 'Total (Max 100%)',
				value: '100'
			}
		])
	})

	// type=pass-fail, status=failed, failedResult=no-score:

	test('type=pass-fail, status=failed, failedResult=no-score, passing=80-100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 'no-score',
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: null,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: null,
					status: 'failed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'You need an attempt score of 80-100% to pass'
			}
		])
	})

	test('type=pass-fail, status=failed, failedResult=0, passing=80-100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: 0,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 0,
					status: 'failed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Given score for a non-passing (less than 80%) attempt',
				value: '0'
			}
		])
	})

	// type=pass-fail, status=failed, failedResult=0:

	test('type=pass-fail, status=failed, failedResult=no-score, passing=100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 'no-score',
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: null,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: null,
					status: 'failed'
				},
				10
			)
		).toEqual([
			{
				type: 'line',
				text: 'You need an attempt score of 100% to pass'
			}
		])
	})

	test('type=pass-fail, status=failed, failedResult=0, passing=100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 50
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: 0,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 0,
					status: 'failed'
				},
				10
			)
		).toEqual([
			{
				type: 'value',
				text: 'Given score for a non-passing (less than 100%) attempt',
				value: '0'
			}
		])
	})

	// type=pass-fail, status=unableToPass, unableToPassResult=no-score:

	test('type=pass-fail, status=unableToPass, unableToPassResult=no-score, passing=80-100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 'no-score'
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: null,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: null,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'line',
				text: 'You needed an attempt score of 80-100% to pass'
			}
		])
	})

	test('type=pass-fail, status=unableToPass, unableToPassResult=no-score, passing=100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 'no-score'
			}).getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: null,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: null,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'line',
				text: 'You needed an attempt score of 100% to pass'
			}
		])
	})

	// type=pass-fail, status=unableToPass, unableToPassResult=$highest_attempt_score:

	test('type=pass-fail, status=unableToPass, unableToPassResult=$highest_attempt_score, passing=80-100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: '$highest_attempt_score'
			}).getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 50,
					assessmentScore: 75,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 75,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your highest attempt score (Attempt 1)'
			}
		])
	})

	test('type=pass-fail, status=unableToPass, unableToPassResult=$highest_attempt_score, passing=100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: '$highest_attempt_score'
			}).getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 50,
					assessmentScore: 75,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 75,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'line',
				text: 'This is your highest attempt score (Attempt 1)'
			}
		])
	})

	// type=pass-fail, status=unableToPass, unableToPassResult=0

	test('type=pass-fail, status=unableToPass, unableToPassResult=0, passing=80-100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 80,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 0
			}).getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 50,
					assessmentScore: 75,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 75,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'value',
				text: 'Given score for not achieving a passing (80-100%) attempt',
				value: '0'
			}
		])
	})

	test('type=pass-fail, status=unableToPass, unableToPassResult=0, passing=100%', () => {
		expect(
			new AssessmentScoreReport({
				type: 'pass-fail',
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: 0
			}).getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 50,
					assessmentScore: 75,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 75,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'value',
				text: 'Given score for not achieving a passing (100%) attempt',
				value: '0'
			}
		])
	})

	// mods:

	test('rewarded mods generate as expected', () => {
		let asr = new AssessmentScoreReport({
			type: 'attempt',
			mods: [
				{ attemptCondition: '1', reward: 0 },
				{ attemptCondition: '2', reward: -1 },
				{ attemptCondition: '$last_attempt', reward: 2 },
				{ attemptCondition: '[1,2]', reward: -3 },
				{ attemptCondition: '(1,2]', reward: 4 },
				{ attemptCondition: '[1,2)', reward: -5 },
				{ attemptCondition: '(1,2)', reward: 6 },
				{ attemptCondition: '[2,3]', reward: -7 },
				{ attemptCondition: '(2,3]', reward: 8 },
				{ attemptCondition: '[2,3)', reward: -9 },
				{ attemptCondition: '(2,3)', reward: 10 },
				{ attemptCondition: '[3,$last_attempt]', reward: -11 },
				{ attemptCondition: '(3,$last_attempt]', reward: 12 },
				{ attemptCondition: '[3,$last_attempt)', reward: -13 },
				{ attemptCondition: '(3,$last_attempt)', reward: 14 }
			]
		})

		expect(
			asr.getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 50,
					assessmentScore: 50,
					rewardedMods: [0, 3, 5],
					rewardTotal: -8,
					assessmentModdedScore: 42,
					status: 'passed'
				},
				5
			)
		).toEqual([
			{
				type: 'value',
				text: 'Attempt 1 score',
				value: '50'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				value: '0'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 1 to 2',
				value: '3'
			},
			{
				type: 'penalty',
				text: 'Passed on first attempt',
				value: '5'
			},
			{
				type: 'total',
				text: 'Total',
				value: '42'
			}
		])

		expect(
			asr.getTextItems(
				{
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: 50,
					rewardedMods: [1, 3, 4, 7, 9],
					rewardTotal: -16,
					assessmentModdedScore: 34,
					status: 'passed'
				},
				5
			)
		).toEqual([
			{
				type: 'value',
				text: 'Attempt 2 score',
				value: '50'
			},
			{
				type: 'penalty',
				text: 'Passed on attempt 2',
				value: '1'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 1 to 2',
				value: '3'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempt 2',
				value: '4'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 2 to 3',
				value: '7'
			},
			{
				type: 'penalty',
				text: 'Passed on attempt 2',
				value: '9'
			},

			{
				type: 'total',
				text: 'Total',
				value: '34'
			}
		])

		expect(
			asr.getTextItems(
				{
					attemptNumber: 3,
					attemptScore: 50,
					assessmentScore: 50,
					rewardedMods: [7, 8, 11, 13],
					rewardTotal: -23,
					assessmentModdedScore: 27,
					status: 'passed'
				},
				5
			)
		).toEqual([
			{
				type: 'value',
				text: 'Attempt 3 score',
				value: '50'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 2 to 3',
				value: '7'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempt 3',
				value: '8'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 3 to 5',
				value: '11'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 3 to 4',
				value: '13'
			},
			{
				type: 'total',
				text: 'Total',
				value: '27'
			}
		])

		expect(
			asr.getTextItems(
				{
					attemptNumber: 4,
					attemptScore: 50,
					assessmentScore: 50,
					rewardedMods: [11, 13],
					rewardTotal: -23,
					assessmentModdedScore: 26,
					status: 'passed'
				},
				5
			)
		).toEqual([
			{
				type: 'value',
				text: 'Attempt 4 score',
				value: '50'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 3 to 5',
				value: '11'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 3 to 4',
				value: '13'
			},
			{
				type: 'total',
				text: 'Total',
				value: '26'
			}
		])

		expect(
			asr.getTextItems(
				{
					attemptNumber: 5,
					attemptScore: 50,
					assessmentScore: 50,
					rewardedMods: [11, 12],
					rewardTotal: 1,
					assessmentModdedScore: 51,
					status: 'passed'
				},
				5
			)
		).toEqual([
			{
				type: 'value',
				text: 'Attempt 5 score',
				value: '50'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 3 to 5',
				value: '11'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 4 to 5',
				value: '12'
			},
			{
				type: 'total',
				text: 'Total',
				value: '51'
			}
		])
	})

	test('throws error when given bad input', () => {
		try {
			new AssessmentScoreReport({
				type: 'pass-fail',
				passedResult: 'invalid-value'
			}).getTextItems(
				{
					attemptNumber: 1,
					attemptScore: 100,
					assessmentScore: 100,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 100,
					status: 'passed'
				},
				10
			)

			expect('this').toBe('not called')
		} catch (e) {
			expect(e.message).toBe('Unknown assessment rubric and score state')
			return
		}

		expect('this').toBe('not called')
	})
})
