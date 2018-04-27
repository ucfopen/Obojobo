import AssessmentScoreReporter from '../../../src/scripts/viewer/assessment/assessment-score-reporter'

let getTextItems = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-text-items')
	.default
jest.mock('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-text-items')

let getReportDetailsForAttempt = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-details-for-attempt')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-details-for-attempt'
)

let getReportDisplayValuesForAttempt = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-display-values-for-attempt')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-display-values-for-attempt'
)

let getScoreChangeDescription = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-change-description')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-change-description'
)

let getScoreComparisionData = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-comparision-data')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-comparision-data'
)

describe('AssessmentScoreReporter', () => {
	test('getReportFor calls helper methods', () => {
		new AssessmentScoreReporter({
			assessmentRubric: {
				type: 'attempt'
			},
			allAttempts: [
				{
					assessmentScoreDetails: {}
				}
			],
			totalNumberOfAttemptsAllowed: 100
		}).getReportFor(1)

		expect(getTextItems).toHaveBeenCalled()
		expect(getReportDetailsForAttempt).toHaveBeenCalled()
		expect(getReportDisplayValuesForAttempt).toHaveBeenCalled()
		expect(getScoreChangeDescription).toHaveBeenCalled()
		expect(getScoreComparisionData).toHaveBeenCalled()
	})

	test('throws error when given bad input', () => {
		try {
			new AssessmentScoreReporter(
				{
					type: 'attempt'
				},
				[],
				100
			).getReportFor(0)

			expect('this').toBe('not called')
		} catch (e) {
			expect(e.message).toBe(
				'attemptNumberToGenerateReportFor parameter is not zero-indexed - Use "1" for first attempt'
			)
			return
		}

		expect('this').toBe('not called')
	})
})
