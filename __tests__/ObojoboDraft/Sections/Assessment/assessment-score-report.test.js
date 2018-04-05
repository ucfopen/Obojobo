import AssessmentScoreReport from '../../../../ObojoboDraft/Sections/Assessment/post-assessment/assessment-score-report'

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
				type: 'value',
				text: 'Score',
				value: '90'
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
				text: 'Base Score',
				value: '90'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				value: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				type: 'value',
				text: 'Score',
				value: '90'
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
				text: 'Base Score',
				value: '90'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				type: 'value',
				text: 'Score',
				value: '100'
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
				text: 'Base Score',
				value: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
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
				type: 'value',
				text: 'Base Score',
				value: '90'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Rewarded score for a passing attempt',
				value: '100'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: '100'
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
				text: 'Base Score',
				value: '90'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Rewarded score for a passing attempt',
				value: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
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
				type: 'value',
				text: 'Base Score',
				value: '100'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Rewarded score for a passing attempt',
				value: '100'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: '100'
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
				text: 'Base Score',
				value: '100'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Rewarded score for a passing attempt',
				value: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempts 1 to 2',
				value: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
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
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You need 80-100% to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: 'No Score Recorded'
			}
		])
	})

	test('type=pass-fail, status=failed, failedResult=0, passing=80-100% or false', () => {
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
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Given score for a non-passing (less than 80%) attempt',
				value: '0'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You need 100% to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: 'No Score Recorded'
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
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Given score for a non-passing (less than 100%) attempt',
				value: '0'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You needed 80-100% to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: 'No Score Recorded'
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
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You needed 100% to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: 'No Score Recorded'
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
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text:
					'You did not achieve a passing 80-100% score within the number of attempts available. Your highest attempt score will be used instead.'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Highest attempt score (Attempt\u00a01)',
				value: '75'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: '75'
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
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text:
					'You did not achieve a passing 100% score within the number of attempts available. Your highest attempt score will be used instead.'
			},
			{
				type: 'divider'
			},
			{
				type: 'value',
				text: 'Highest attempt score (Attempt\u00a01)',
				value: '75'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				value: '75'
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
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: 0,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 0,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You did not achieve a passing 80-100% score within the number of attempts available.'
			},
			{
				type: 'value',
				text: 'Given score for not achieving a passing attempt',
				value: '0'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
					attemptNumber: 2,
					attemptScore: 50,
					assessmentScore: 0,
					rewardedMods: [],
					rewardTotal: 0,
					assessmentModdedScore: 0,
					status: 'unableToPass'
				},
				2
			)
		).toEqual([
			{
				type: 'value',
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You did not achieve a passing 100% score within the number of attempts available.'
			},
			{
				type: 'value',
				text: 'Given score for not achieving a passing attempt',
				value: '0'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				text: 'Base Score',
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
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'penalty',
				text: 'Passed on attempt\u00a02',
				value: '1'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 1 to 2',
				value: '3'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempt\u00a02',
				value: '4'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 2 to 3',
				value: '7'
			},
			{
				type: 'penalty',
				text: 'Passed on attempt\u00a02',
				value: '9'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				text: 'Base Score',
				value: '50'
			},
			{
				type: 'penalty',
				text: 'Passed on attempts 2 to 3',
				value: '7'
			},
			{
				type: 'extra-credit',
				text: 'Passed on attempt\u00a03',
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
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				text: 'Base Score',
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
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
				text: 'Base Score',
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
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
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
