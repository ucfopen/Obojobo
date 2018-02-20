import AssessmentRubric from '../../server/assessment-rubric'

describe('AssessmentRubric', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Default case with no scores returns null', () => {
		let ar = new AssessmentRubric()

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [])).toEqual(null)
	})

	test('Default case with scores returns highest score', () => {
		let ar = new AssessmentRubric()

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0])).toEqual({
			attemptNumber: 1,
			attemptScore: 0,
			status: 'passed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0, 20])).toEqual({
			attemptNumber: 2,
			attemptScore: 20,
			status: 'passed',
			assessmentScore: 20,
			rewardTotal: 0,
			assessmentModdedScore: 20,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0, 20, 10])).toEqual({
			attemptNumber: 3,
			attemptScore: 10,
			status: 'passed',
			assessmentScore: 10,
			rewardTotal: 0,
			assessmentModdedScore: 10,
			rewardedMods: []
		})
	})

	test('type attempt works like default case', () => {
		let ar1 = new AssessmentRubric()
		let ar2 = new AssessmentRubric({ type: 'attempt' })

		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [0])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [0])
		)
		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [0, 20])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [0, 20])
		)
		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [0, 20, 10])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [0, 20, 10])
		)
	})

	test('pass-fail rewards the passing score when passing and the failing score when failing', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 80,
			passedResult: 100,
			failedResult: 0
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0])).toEqual({
			attemptNumber: 1,
			attemptScore: 0,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [79])).toEqual({
			attemptNumber: 1,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [79.999])).toEqual({
			attemptNumber: 1,
			attemptScore: 79.999,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 100,
			rewardTotal: 0,
			assessmentModdedScore: 100,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80.01])).toEqual({
			attemptNumber: 1,
			attemptScore: 80.01,
			status: 'passed',
			assessmentScore: 100,
			rewardTotal: 0,
			assessmentModdedScore: 100,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0, 0, 80, 0])).toEqual({
			attemptNumber: 4,
			attemptScore: 0,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
	})

	test('pass-fail rewards null when using no-score', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 80,
			passedResult: 100,
			failedResult: 'no-score'
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0])).toEqual({
			attemptNumber: 1,
			attemptScore: 0,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})

		// expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0]).toEqual(null)
	})

	test('pass-fail rewards attempt score when using $attempt_score variable', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 80,
			passedResult: '$attempt_score',
			failedResult: 'no-score'
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 0,
			assessmentModdedScore: 80,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80, 90])).toEqual({
			attemptNumber: 2,
			attemptScore: 90,
			status: 'passed',
			assessmentScore: 90,
			rewardTotal: 0,
			assessmentModdedScore: 90,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80, 90, 100])).toEqual({
			attemptNumber: 3,
			attemptScore: 100,
			status: 'passed',
			assessmentScore: 100,
			rewardTotal: 0,
			assessmentModdedScore: 100,
			rewardedMods: []
		})
	})

	test('pass-fail rewards different failing result for final attempt with unableToPassResult', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 80,
			passedResult: '$attempt_score',
			failedResult: 'no-score',
			unableToPassResult: '$highest_attempt_score'
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(3, [79])).toEqual({
			attemptNumber: 1,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(3, [79, 79])).toEqual({
			attemptNumber: 2,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(3, [79, 79, 79])).toEqual({
			attemptNumber: 3,
			attemptScore: 79,
			status: 'unableToPass',
			assessmentScore: 79,
			rewardTotal: 0,
			assessmentModdedScore: 79,
			rewardedMods: []
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(3, [79, 80])).toEqual({
			attemptNumber: 2,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 0,
			assessmentModdedScore: 80,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(3, [79, 80, 79])).toEqual({
			attemptNumber: 3,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})
	})

	test('type attempt ignores additional options', () => {
		let ar1 = new AssessmentRubric({
			type: 'attempt',
			passingAttemptScore: 80,
			passedResult: 100,
			failedResult: 0,
			unableToPassResult: '$highest_attempt_score'
		})
		let ar2 = new AssessmentRubric({
			type: 'attempt'
		})

		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [80])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [80])
		)
		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [80, 90])
		)
		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [100, 80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [100, 80, 90])
		)
	})

	test('unsupported type defaults to "attempt" type', () => {
		let ar1 = new AssessmentRubric({
			type: 'fake-type'
		})
		let ar2 = new AssessmentRubric({
			type: 'attempt'
		})

		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [80])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [80])
		)
		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [80, 90])
		)
		expect(ar1.getAssessmentScoreInfoForLatestAttempt(10, [100, 80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForLatestAttempt(10, [100, 80, 90])
		)
	})

	test('mods apply correctly', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					attemptCondition: 1,
					reward: 1
				},
				{
					attemptCondition: 2,
					scoreCondition: '[80,100]',
					reward: 3
				},
				{
					attemptCondition: '[2,3]',
					scoreCondition: 50,
					reward: 7
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 1,
			assessmentModdedScore: 81,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80, 80])).toEqual({
			attemptNumber: 2,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 3,
			assessmentModdedScore: 83,
			rewardedMods: [1]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80, 50])).toEqual({
			attemptNumber: 2,
			attemptScore: 50,
			status: 'passed',
			assessmentScore: 50,
			rewardTotal: 7,
			assessmentModdedScore: 57,
			rewardedMods: [2]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80, 51])).toEqual({
			attemptNumber: 2,
			attemptScore: 51,
			status: 'passed',
			assessmentScore: 51,
			rewardTotal: 0,
			assessmentModdedScore: 51,
			rewardedMods: []
		})
	})

	test('mods support ( and [ syntax', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					scoreCondition: '[60,80)',
					reward: 1
				},
				{
					scoreCondition: '[80,100]',
					reward: 2
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [59])).toEqual({
			attemptNumber: 1,
			attemptScore: 59,
			status: 'passed',
			assessmentScore: 59,
			rewardTotal: 0,
			assessmentModdedScore: 59,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [60])).toEqual({
			attemptNumber: 1,
			attemptScore: 60,
			status: 'passed',
			assessmentScore: 60,
			rewardTotal: 1,
			assessmentModdedScore: 61,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [79.999])).toEqual({
			attemptNumber: 1,
			attemptScore: 79.999,
			status: 'passed',
			assessmentScore: 79.999,
			rewardTotal: 1,
			assessmentModdedScore: 80.999,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 2,
			assessmentModdedScore: 82,
			rewardedMods: [1]
		})
	})

	test('overlapping mods support', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					scoreCondition: '[60,80)',
					reward: 1
				},
				{
					scoreCondition: '[70,100]',
					reward: 2
				},
				{
					attemptCondition: '(1,2]',
					reward: 3
				},
				{
					attemptCondition: '[2,3]',
					reward: 4
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [59])).toEqual({
			attemptNumber: 1,
			attemptScore: 59,
			status: 'passed',
			assessmentScore: 59,
			rewardTotal: 0,
			assessmentModdedScore: 59,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [60])).toEqual({
			attemptNumber: 1,
			attemptScore: 60,
			status: 'passed',
			assessmentScore: 60,
			rewardTotal: 1,
			assessmentModdedScore: 61,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [70])).toEqual({
			attemptNumber: 1,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 3,
			assessmentModdedScore: 73,
			rewardedMods: [0, 1]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0, 70])).toEqual({
			attemptNumber: 2,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 10,
			assessmentModdedScore: 80,
			rewardedMods: [0, 1, 2, 3]
		})
		expect(ar.getAssessmentScoreInfoForLatestAttempt(10, [0, 0, 70])).toEqual({
			attemptNumber: 3,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 7,
			assessmentModdedScore: 77,
			rewardedMods: [0, 1, 3]
		})
	})

	test('$last_attempt support', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					attemptCondition: '$last_attempt',
					reward: 1
				},
				{
					attemptCondition: '[1,$last_attempt]', // should always apply
					reward: 2
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(2, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 2,
			assessmentModdedScore: 82,
			rewardedMods: [1]
		})

		expect(ar.getAssessmentScoreInfoForLatestAttempt(2, [80, 80])).toEqual({
			attemptNumber: 2,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 3,
			assessmentModdedScore: 83,
			rewardedMods: [0, 1]
		})
	})
})
