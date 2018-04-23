import getReportDetailsForAttempt from '../../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-details-for-attempt.js'
import getStatusResult from '../../../../src/scripts/viewer/assessment/assessment-score-reporter/get-status-result.js'

jest.mock(
	'../../../../src/scripts/viewer/assessment/assessment-score-reporter/get-status-result.js',
	() => {
		return () => 'mocked-status-result'
	}
)

describe('getReportDetailsForAttempt', () => {
	test('returns expected data structure', () => {
		expect(
			getReportDetailsForAttempt(
				{
					type: 'rubric-type',
					mods: [],
					passingAttemptScore: 50
				},
				{
					status: 'mocked-status',
					attemptNumber: 1,
					attemptScore: 100,
					rewardedMods: [],
					assessmentScore: 100,
					assessmentModdedScore: 100
				}
			)
		).toEqual({
			rubricType: 'rubric-type',
			mods: [],
			status: 'mocked-status',
			statusResult: 'mocked-status-result',
			isAttemptScore100: true,
			isAssessScoreOver100: false,
			passingAttemptScore: 50
		})
	})

	test('mods property is a map of rewarded mods', () => {
		expect(
			getReportDetailsForAttempt(
				{
					type: 'rubric-type',
					mods: ['mod-0', 'mod-1', 'mod-2']
				},
				{
					rewardedMods: [0, 2]
				}
			).mods
		).toEqual(['mod-0', 'mod-2'])
	})

	test('isAttemptScore100 works', () => {
		expect(
			getReportDetailsForAttempt(
				{
					mods: []
				},
				{
					rewardedMods: [],
					attemptScore: 99
				}
			).isAttemptScore100
		).toBe(false)

		expect(
			getReportDetailsForAttempt(
				{
					mods: []
				},
				{
					rewardedMods: [],
					attemptScore: 100
				}
			).isAttemptScore100
		).toBe(true)
	})
})
