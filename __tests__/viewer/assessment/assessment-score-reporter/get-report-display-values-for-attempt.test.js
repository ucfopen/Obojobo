import getReportDisplayValuesForAttempt from '../../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-display-values-for-attempt.js'

describe('getReportDisplayValuesForAttempt', () => {
	test('returns expected data structure', () => {
		expect(
			getReportDisplayValuesForAttempt(
				{
					attemptNumber: 20,
					attemptScore: 30,
					assessmentModdedScore: 40
				},
				50
			)
		).toEqual({
			attemptNum: '20',
			attemptScore: '30',
			assessScore: '40',
			totalNumberOfAttemptsAllowed: '50'
		})
	})

	test('returns default value for passingAttemptScore', () => {
		expect(
			getReportDisplayValuesForAttempt(
				{
					attemptNumber: 20,
					attemptScore: 30,
					assessmentModdedScore: 40
				},
				50
			)
		).toEqual({
			attemptNum: '20',
			attemptScore: '30',
			assessScore: '40',
			totalNumberOfAttemptsAllowed: '50'
		})
	})
})
