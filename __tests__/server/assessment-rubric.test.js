import AssessmentRubric from '../../server/assessment-rubric'

describe('AssessmentRubric', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Default case with no scores returns null', () => {
		let ar = new AssessmentRubric()

		expect(ar.getAssessmentScoreInfoForAttempt(10, [])).toEqual(null)
	})

	test('Default case with scores returns highest score', () => {
		let ar = new AssessmentRubric()

		expect(ar.getAssessmentScoreInfoForAttempt(10, [0])).toEqual({
			attemptNumber: 1,
			attemptScore: 0,
			status: 'passed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [0, 20])).toEqual({
			attemptNumber: 2,
			attemptScore: 20,
			status: 'passed',
			assessmentScore: 20,
			rewardTotal: 0,
			assessmentModdedScore: 20,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [0, 20, 10])).toEqual({
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

		expect(ar1.getAssessmentScoreInfoForAttempt(10, [0])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [0])
		)
		expect(ar1.getAssessmentScoreInfoForAttempt(10, [0, 20])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [0, 20])
		)
		expect(ar1.getAssessmentScoreInfoForAttempt(10, [0, 20, 10])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [0, 20, 10])
		)
	})

	test('pass-fail rewards the passing score when passing and the failing score when failing', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 80,
			passedResult: 100,
			failedResult: 0
		})

		expect(ar.getAssessmentScoreInfoForAttempt(10, [0])).toEqual({
			attemptNumber: 1,
			attemptScore: 0,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [79])).toEqual({
			attemptNumber: 1,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [79.999])).toEqual({
			attemptNumber: 1,
			attemptScore: 79.999,
			status: 'failed',
			assessmentScore: 0,
			rewardTotal: 0,
			assessmentModdedScore: 0,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 100,
			rewardTotal: 0,
			assessmentModdedScore: 100,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80.01])).toEqual({
			attemptNumber: 1,
			attemptScore: 80.01,
			status: 'passed',
			assessmentScore: 100,
			rewardTotal: 0,
			assessmentModdedScore: 100,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [0, 0, 80, 0])).toEqual({
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

		expect(ar.getAssessmentScoreInfoForAttempt(10, [0])).toEqual({
			attemptNumber: 1,
			attemptScore: 0,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})

		// expect(ar.getAssessmentScoreInfoForAttempt(10, [0]).toEqual(null)
	})

	test('pass-fail rewards attempt score when using $attempt_score variable', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 80,
			passedResult: '$attempt_score',
			failedResult: 'no-score'
		})

		expect(ar.getAssessmentScoreInfoForAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 0,
			assessmentModdedScore: 80,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80, 90])).toEqual({
			attemptNumber: 2,
			attemptScore: 90,
			status: 'passed',
			assessmentScore: 90,
			rewardTotal: 0,
			assessmentModdedScore: 90,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80, 90, 100])).toEqual({
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

		expect(ar.getAssessmentScoreInfoForAttempt(3, [79])).toEqual({
			attemptNumber: 1,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})

		expect(ar.getAssessmentScoreInfoForAttempt(3, [79, 79])).toEqual({
			attemptNumber: 2,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(3, [79, 79, 79])).toEqual({
			attemptNumber: 3,
			attemptScore: 79,
			status: 'unableToPass',
			assessmentScore: 79,
			rewardTotal: 0,
			assessmentModdedScore: 79,
			rewardedMods: []
		})

		expect(ar.getAssessmentScoreInfoForAttempt(3, [79, 80])).toEqual({
			attemptNumber: 2,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 0,
			assessmentModdedScore: 80,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(3, [79, 80, 79])).toEqual({
			attemptNumber: 3,
			attemptScore: 79,
			status: 'failed',
			assessmentScore: null,
			rewardTotal: 0,
			assessmentModdedScore: null,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(3, [70, 60, 50])).toEqual({
			attemptNumber: 1,
			attemptScore: 70,
			status: 'unableToPass',
			assessmentScore: 70,
			rewardTotal: 0,
			assessmentModdedScore: 70,
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

		expect(ar1.getAssessmentScoreInfoForAttempt(10, [80])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [80])
		)
		expect(ar1.getAssessmentScoreInfoForAttempt(10, [80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [80, 90])
		)
		expect(ar1.getAssessmentScoreInfoForAttempt(10, [100, 80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [100, 80, 90])
		)
	})

	test('unsupported type defaults to "attempt" type', () => {
		let ar1 = new AssessmentRubric({
			type: 'fake-type'
		})
		let ar2 = new AssessmentRubric({
			type: 'attempt'
		})

		expect(ar1.getAssessmentScoreInfoForAttempt(10, [80])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [80])
		)
		expect(ar1.getAssessmentScoreInfoForAttempt(10, [80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [80, 90])
		)
		expect(ar1.getAssessmentScoreInfoForAttempt(10, [100, 80, 90])).toEqual(
			ar2.getAssessmentScoreInfoForAttempt(10, [100, 80, 90])
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
					reward: 3
				},
				{
					attemptCondition: '[2,3]',
					reward: 7
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 1,
			assessmentModdedScore: 81,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80, 80])).toEqual({
			attemptNumber: 2,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 10,
			assessmentModdedScore: 90,
			rewardedMods: [1, 2]
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80, 50])).toEqual({
			attemptNumber: 2,
			attemptScore: 50,
			status: 'passed',
			assessmentScore: 50,
			rewardTotal: 10,
			assessmentModdedScore: 60,
			rewardedMods: [1, 2]
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [80, 51, 70])).toEqual({
			attemptNumber: 3,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 7,
			assessmentModdedScore: 77,
			rewardedMods: [2]
		})
	})

	test('mods support ( and [ syntax', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					attemptCondition: '[1,3)', //1, 2
					reward: 1
				},
				{
					attemptCondition: '(3,4]', //4
					reward: 2
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForAttempt(10, [59])).toEqual({
			attemptNumber: 1,
			attemptScore: 59,
			status: 'passed',
			assessmentScore: 59,
			rewardTotal: 1,
			assessmentModdedScore: 60,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [59, 60])).toEqual({
			attemptNumber: 2,
			attemptScore: 60,
			status: 'passed',
			assessmentScore: 60,
			rewardTotal: 1,
			assessmentModdedScore: 61,
			rewardedMods: [0]
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [59, 60, 61])).toEqual({
			attemptNumber: 3,
			attemptScore: 61,
			status: 'passed',
			assessmentScore: 61,
			rewardTotal: 0,
			assessmentModdedScore: 61,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [59, 60, 61, 62])).toEqual({
			attemptNumber: 4,
			attemptScore: 62,
			status: 'passed',
			assessmentScore: 62,
			rewardTotal: 2,
			assessmentModdedScore: 64,
			rewardedMods: [1]
		})
	})

	test('overlapping mods support', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
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

		expect(ar.getAssessmentScoreInfoForAttempt(10, [59])).toEqual({
			attemptNumber: 1,
			attemptScore: 59,
			status: 'passed',
			assessmentScore: 59,
			rewardTotal: 0,
			assessmentModdedScore: 59,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [60])).toEqual({
			attemptNumber: 1,
			attemptScore: 60,
			status: 'passed',
			assessmentScore: 60,
			rewardTotal: 0,
			assessmentModdedScore: 60,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [70])).toEqual({
			attemptNumber: 1,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 0,
			assessmentModdedScore: 70,
			rewardedMods: []
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [0, 70])).toEqual({
			attemptNumber: 2,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 7,
			assessmentModdedScore: 77,
			rewardedMods: [0, 1]
		})
		expect(ar.getAssessmentScoreInfoForAttempt(10, [0, 0, 70])).toEqual({
			attemptNumber: 3,
			attemptScore: 70,
			status: 'passed',
			assessmentScore: 70,
			rewardTotal: 4,
			assessmentModdedScore: 74,
			rewardedMods: [1]
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

		expect(ar.getAssessmentScoreInfoForAttempt(2, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 2,
			assessmentModdedScore: 82,
			rewardedMods: [1]
		})

		expect(ar.getAssessmentScoreInfoForAttempt(2, [80, 80])).toEqual({
			attemptNumber: 2,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 3,
			assessmentModdedScore: 83,
			rewardedMods: [0, 1]
		})
	})

	test('assessment score ceiling at 100', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					attemptCondition: 1,
					reward: 100
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: 100,
			assessmentModdedScore: 100,
			rewardedMods: [0]
		})
	})

	test('assessment score floor at 0', () => {
		let ar = new AssessmentRubric({
			type: 'attempt',
			mods: [
				{
					attemptCondition: 1,
					reward: -100
				}
			]
		})

		expect(ar.getAssessmentScoreInfoForAttempt(10, [80])).toEqual({
			attemptNumber: 1,
			attemptScore: 80,
			status: 'passed',
			assessmentScore: 80,
			rewardTotal: -100,
			assessmentModdedScore: 0,
			rewardedMods: [0]
		})
	})

	test('Stores original passed in rubric', () => {
		let ar = new AssessmentRubric({
			type: 'pass-fail',
			ignorableValue: 1234
		})

		expect(ar.originalRubric).toEqual({
			type: 'pass-fail',
			ignorableValue: 1234
		})
	})

	test('toObject returns a complete rubric', () => {
		let ar = new AssessmentRubric()

		expect(ar.toObject()).toEqual({
			type: 'attempt',
			passingAttemptScore: 0,
			passedResult: '$attempt_score',
			failedResult: 0,
			unableToPassResult: null,
			mods: []
		})

		ar = new AssessmentRubric({
			type: 'pass-fail',
			mods: [
				{
					attemptCondition: '$last_attempt',
					reward: 0
				},
				{
					attemptCondition: '1',
					reward: 5
				},
				{
					attemptCondition: '(2  ,  $last_attempt]',
					reward: 10
				},
				{
					attemptCondition: '(3,4]',
					reward: 15
				}
			]
		})

		expect(ar.toObject()).toEqual({
			type: 'pass-fail',
			passingAttemptScore: 100,
			passedResult: 100,
			failedResult: 0,
			unableToPassResult: null,
			mods: [
				{
					attemptCondition: '$last_attempt',
					reward: 0
				},
				{
					attemptCondition: '1',
					reward: 5
				},
				{
					attemptCondition: '(2,$last_attempt]',
					reward: 10
				},
				{
					attemptCondition: '(3,4]',
					reward: 15
				}
			]
		})

		ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 50,
			passedResult: '$attempt_score',
			failedResult: 'no-score',
			unableToPassResult: '$highest_attempt_score'
		})

		expect(ar.toObject()).toEqual({
			type: 'pass-fail',
			passingAttemptScore: 50,
			passedResult: '$attempt_score',
			failedResult: 'no-score',
			unableToPassResult: '$highest_attempt_score',
			mods: []
		})
	})

	test('clone clones', () => {
		let ar = new AssessmentRubric()

		expect(ar.clone()).toEqual(ar)

		ar = new AssessmentRubric({
			type: 'pass-fail',
			mods: [
				{
					attemptCondition: '1',
					reward: 5
				},
				{
					attemptCondition: '(2,4]',
					reward: 10
				},
				{
					attemptCondition: '(3,4]',
					reward: 15
				}
			]
		})

		expect(ar.clone()).toEqual(ar)

		ar = new AssessmentRubric({
			type: 'pass-fail',
			passingAttemptScore: 50,
			passedResult: '$attempt_score',
			failedResult: 'no-score',
			unableToPassResult: '$highest_attempt_score'
		})

		expect(ar.clone()).toEqual(ar)
	})
})
